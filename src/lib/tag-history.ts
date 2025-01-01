import { Tag } from '@/types/tags';

interface TagOperation {
  type: 'create' | 'update' | 'delete';
  tag: Tag;
  previousState?: Tag;
}

class TagHistoryService {
  private operations: TagOperation[] = [];

  addOperation(type: TagOperation['type'], tag: Tag, previousState?: Tag) {
    this.operations.push({ type, tag, previousState });
  }

  getLastOperation(): TagOperation | undefined {
    return this.operations[this.operations.length - 1];
  }

  clearHistory() {
    this.operations = [];
  }
}

export const tagHistory = new TagHistoryService();