"""Compatibility wrapper for the project asset generator.

Run this file or scripts/build_real_assets.py to rebuild the local image set.
"""

from build_real_assets import create_all_assets


if __name__ == "__main__":
    create_all_assets()
    print("Real World Cup assets rebuilt. See assets/asset-sources.json for sources.")
