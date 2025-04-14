# VCS Memory System

This directory contains the version control system (VCS) integration for the Memory Bank. It tracks and manages snapshots of memory states, particularly around significant project events like commits.

## Directory Structure

- `config.json`: Configuration settings for the VCS memory system
- `snapshots.json`: Metadata about memory snapshots
- `snapshots/`: Directory containing the actual snapshot files (created as needed)

## Features

- Automatic snapshot creation on Git commits
- Retention policy management
- Branch-aware memory tracking
- Commit hook integration

## Snapshot Format

Snapshots are stored in the `snapshots/` directory with the following naming convention:

```
YYYYMMDD_HHMMSS_[commit_hash].json
```

Each snapshot contains:

- Full state of tracked memory files
- Git commit reference (if applicable)
- Branch information
- Timestamp
- Change metadata

## Usage

The VCS memory system operates automatically when integrated with Git. Manual snapshots can be created using:

```
mem:snapshot "description"
```

## Retention Policy

As configured in `config.json`:

- Maximum 50 snapshots retained
- Snapshots older than 30 days are automatically pruned
- Critical snapshots (marked as important) are exempt from automatic pruning
