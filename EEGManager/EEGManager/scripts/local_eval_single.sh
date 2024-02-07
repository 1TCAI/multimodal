#!/bin/bash

# Quit early if any command fails.
set -ex

cd /content && \
gcloud beta ml local train \
  --package-path=src \
  --module-name=src.eval \
  -- \
  --dataset_dir="/content/dataset/eval/*.tfr" \
  --checkpoint_dir="/content/checkpoints/eegnetv1_save1" \
  --log_dir="/content/logs"
  