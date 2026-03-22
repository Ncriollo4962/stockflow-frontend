import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalLoadingService {
  private readonly pendingCount = signal(0);
  private readonly visible = signal(false);

  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private lastShownAt = 0;
  private lastStoppedAt = 0;

  readonly isLoading = this.visible.asReadonly();

  start() {
    const next = this.pendingCount() + 1;
    this.pendingCount.set(next);

    if (next !== 1) return;

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    if (this.visible()) return;

    if (this.showTimer) clearTimeout(this.showTimer);
    const delaySinceStop = Date.now() - this.lastStoppedAt;
    const showDelayMs = delaySinceStop < 250 ? 0 : 200;
    this.showTimer = setTimeout(() => {
      this.showTimer = null;
      if (this.pendingCount() > 0) {
        this.visible.set(true);
        this.lastShownAt = Date.now();
      }
    }, showDelayMs);
  }

  stop() {
    const next = Math.max(0, this.pendingCount() - 1);
    this.pendingCount.set(next);

    if (next !== 0) return;

    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }

    if (!this.visible()) return;

    if (this.hideTimer) clearTimeout(this.hideTimer);

    const minVisibleMs = 450;
    const elapsed = this.lastShownAt ? Date.now() - this.lastShownAt : 0;
    const idleDebounceMs = 200;
    const delay = Math.max(0, minVisibleMs - elapsed) + idleDebounceMs;

    this.hideTimer = setTimeout(() => {
      this.hideTimer = null;
      if (this.pendingCount() === 0) this.visible.set(false);
      this.lastStoppedAt = Date.now();
    }, delay);
  }
}
