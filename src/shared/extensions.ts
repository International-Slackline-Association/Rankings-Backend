Date.prototype.toISODate = function(): string {
  return this.toISOString().split('T')[0];
};
