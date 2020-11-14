class Blocker {
  constructor(jquery) {
    this.jquery = jquery;
  }

  on(message) {
    if (!message) {
      message = '<div class="spinner"></div>';
    }

    this.jquery.blockUI({ message });
    this.jquery(".blockOverlay")
      .attr("title", "Click to unblock")
      .click($.unblockUI);
  }

  off() {
    this.jquery.unblockUI();
  }
}

define(["jquery", "blockUI"], ($, blockUI) => new Blocker($));
