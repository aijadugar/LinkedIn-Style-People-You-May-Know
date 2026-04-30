from huggingface_hub import hf_hub_download, login
import os

login(token=os.getenv('HF'))

repo_id = "aijadugar/pymk-system"

l1_path = hf_hub_download(repo_id, "l1_xgb_model.pkl")
l2_path = hf_hub_download(repo_id, "l2_ranknet.pth")
config_path = hf_hub_download(repo_id, "config.json")
emb_path = hf_hub_download(repo_id, "node2vec.kv")