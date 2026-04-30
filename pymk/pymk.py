import networkx as nx
from gensim.models import KeyedVectors
from hf_hub import l1_path, l2_path, config_path, emb_path
from ranknet import RankNet
import numpy as np
import random
import joblib, torch, json, math

l1_model = joblib.load(l1_path)

with open(config_path) as f:
    config = json.load(f)

model_emb = KeyedVectors.load(emb_path, mmap="r")

l2_model = RankNet()
l2_model.load_state_dict(torch.load(l2_path, map_location="cpu"))
l2_model.eval()
G = nx.barabasi_albert_graph(10000, 5)
G = nx.relabel_nodes(G, lambda x: str(x))

neighbor_cache = {n: set(G.neighbors(n)) for n in G.nodes()}

emb_cache = {}

for node in G.nodes():
    key = str(node)
    if key in model_emb:
        emb_cache[node] = model_emb[key]

def _graph_candidates(G, user, max_candidates=500):
    neighbors = set(G.neighbors(user))
    cands = set()

    for nbr in neighbors:
        for fof in G.neighbors(nbr):
            if fof != user and fof not in neighbors:
                cands.add(fof)
                if len(cands)>=max_candidates:
                    return list(cands)

    return list(cands)

def _embedding_candidates(user, topn=100):
    if user not in model_emb:
        return []
    similar = model_emb.most_similar(user, topn=topn)
    
    return [node for node, _ in similar]

ALL_NODES=list(G.nodes())

def _heuristic_candidates(G, user, k=100):
    neighbors = set(G.neighbors(user))
    excluded = neighbors.union({user})
    
    pool = [n for n in ALL_NODES if n not in excluded]
    if not pool:
        return []

    k1=k//2
    k2=k-k1

    rand_part=random.sample(pool, min(k1, len(pool)))
    weights=[G.degree(n) for n in pool]
    pop_part=random.choices(pool, weights=weights, k=min(k2, len(pool)))
    
    return list(set(rand_part+pop_part))

def _features_L1(G, u, v, cache={}):
    
    if u not in cache:
        cache[u] = set(G.neighbors(u))
    if v not in cache:
        cache[v] = set(G.neighbors(v))
    
    u_neighbors = cache[u]
    v_neighbors = cache[v]
    
    common_neighbors = u_neighbors & v_neighbors
    common = len(common_neighbors)
    
    deg_u = len(u_neighbors)
    deg_v = len(v_neighbors)
    
    union = len(u_neighbors | v_neighbors)
    jaccard = common / union if union != 0 else 0

    adamic_adar = 0
    for z in common_neighbors:
        deg_z = len(cache.get(z, set(G.neighbors(z))))
        if deg_z > 1:
            adamic_adar += 1 / math.log(deg_z)
    
    pref_attach = deg_u * deg_v

    resource_alloc = 0
    for z in common_neighbors:
        deg_z = len(cache.get(z, set(G.neighbors(z))))
        if deg_z > 0:
            resource_alloc += 1 / deg_z

    return [
        common,
        deg_u,
        deg_v,
        jaccard,
        adamic_adar,
        pref_attach,
        resource_alloc
    ]

def _l1_rank(G, model, user, candidates, cache, top_k=100):
    
    if not candidates:
        return []
    
    X_batch = [_features_L1(G, user, c, cache=cache) for c in candidates]
    
    scores = model.predict_proba(X_batch)[:, 1]
    
    scored = list(zip(candidates, scores))
    
    scored.sort(key=lambda x: x[1], reverse=True)
    
    return scored[:top_k]

def _features_L2(u, v, cache):
    
    emb_u = cache.get(u)
    emb_v = cache.get(v)
    
    if emb_u is None or emb_v is None:
        return np.zeros(128)
    
    return np.concatenate([emb_u, emb_v])

def _l2_rank(model, user, l1_results, emb_cache, top_k=20):
    
    if not l1_results:
        return []
    
    model.eval()
    
    candidates = [c for c, _ in l1_results]
    
    X_batch = np.array([_features_L2(user, c, emb_cache) for c in candidates])
    X_tensor = torch.tensor(X_batch).float()
    
    with torch.no_grad():
        logits = model(X_tensor)
        probs = torch.sigmoid(logits).squeeze().numpy()
    
    scored = list(zip(candidates, probs))
    
    scored.sort(key=lambda x: x[1], reverse=True)
    
    return scored[:top_k]

def _rerank_diversity(G, user, results, cache, top_k=10, alpha=0.01):
    
    if not results:
        return []
    
    final = []
    selected = []
    
    for candidate, score in results:
        
        cand_neighbors = cache.get(int(candidate), set())
        
        penalty = 0
        
        for sel_neighbors in selected:
            inter = len(cand_neighbors & sel_neighbors)
            union = len(cand_neighbors | sel_neighbors)
            
            if union > 0:
                penalty += inter / union
        
        adjusted_score = float(score) - alpha * penalty
        
        final.append((candidate, adjusted_score, cand_neighbors))
    
    final.sort(key=lambda x: x[1], reverse=True)
    
    output = []
    
    for cand, score, neigh in final:
        output.append((cand, score))
        selected.append(neigh)
        
        if len(output) >= top_k:
            break
    
    return output

def pymk(user):

    candidates = (_graph_candidates(G, user) + _embedding_candidates(user) + _heuristic_candidates(G, user))

    candidates = list(set(candidates))
    
    l1_res = _l1_rank(G, l1_clearmodel, user, candidates, neighbor_cache)

    l2_res = _l2_rank(l2_model, user, l1_res, emb_cache)

    final = _rerank_diversity(G, user, l2_res, neighbor_cache)

    return final