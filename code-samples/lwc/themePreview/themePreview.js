// LWC sample: imports, decorators, wire adapters, getters, events, and async methods
import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getPreviewRecords from '@salesforce/apex/ThemePreviewController.getPreviewRecords';

const DEFAULT_STAGE = 'Draft';
const STAGE_PATTERN = /^(Draft|Review|Published)$/u;

export default class ThemePreview extends LightningElement {
  @api recordId;
  @api accentColor = '#ff55c8';
  @track records = [];
  filterText = '';
  error;

  @wire(getPreviewRecords, { parentId: '$recordId' })
  wiredRecords({ data, error }) {
    if (data) {
      this.records = data.map((record) => ({
        ...record,
        stage: STAGE_PATTERN.test(record.stage) ? record.stage : DEFAULT_STAGE,
      }));
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.records = [];
    }
  }

  get hasRecords() {
    return this.filteredRecords.length > 0;
  }

  get filteredRecords() {
    const query = this.filterText.trim().toLowerCase();
    return query
      ? this.records.filter(({ name, stage }) => `${name} ${stage}`.toLowerCase().includes(query))
      : this.records;
  }

  get statusVariant() {
    return this.error ? 'error' : this.hasRecords ? 'ready' : 'empty';
  }

  handleFilterChange(event) {
    this.filterText = event.detail.value ?? '';
  }

  async refresh() {
    await Promise.resolve();
    this.dispatchEvent(new CustomEvent('previewrefresh', { detail: { recordId: this.recordId } }));
  }

  publish() {
    this.dispatchEvent(
      new ShowToastEvent({
        title: 'Theme preview published',
        message: `Published ${this.filteredRecords.length} records`,
        variant: 'success',
      })
    );
  }
}
