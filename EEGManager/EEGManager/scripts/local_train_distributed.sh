#!/bin/bash

# Quit early if any command fails.
set -ex

cd /content && \
gcloud beta ml local train \
  --package-path=src \
  --module-name=src.train \
  --distributed \
  -- \
  --dataset_dir="/content/dataset/train/*.tfr" \
  --log_dir="/content/logs" \
  --batch_size=3 \
  --num_splits=5 \
  --num_iters=5000