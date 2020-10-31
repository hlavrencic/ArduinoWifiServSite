class Blocker {
  constructor(jquery) {
    this.jquery = jquery;
  }

  on(message) {
    this.jquery.blockUI({ message });
  }

  off() {
    this.jquery.unblockUI();
  }
}

define(["jquery", "blockUI"], ($, blockUI) => new Blocker($));
