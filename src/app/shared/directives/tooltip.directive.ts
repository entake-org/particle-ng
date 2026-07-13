import { Directive, ElementRef, HostListener, OnDestroy, inject, input, effect, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Overlay, OverlayPositionBuilder, OverlayRef, ConnectedPosition, FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipComponent } from '../components/tooltip/tooltip.component';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[particleTooltip]'
})
export class TooltipDirective implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  particleTooltip = input<string>('');
  tooltipPosition = input<'left' | 'right' | 'top' | 'bottom'>('bottom');
  tooltipDisabled = input<boolean>(false);

  private elementRef = inject(ElementRef);
  private overlay = inject(Overlay);
  private positionBuilder = inject(OverlayPositionBuilder);

  private overlayRef: OverlayRef | null = null;
  private positionSub = new Subscription();
  private readonly TOOLTIP_OFFSET = 15;

  constructor() {
    effect(() => {
      if (!this.isBrowser) {
        return;
      }

      if (this.tooltipDisabled() || !this.particleTooltip()) {
        this.closeTooltip();
      } else if (this.overlayRef?.hasAttached()) {
        this.updatePosition();
      }
    });
  }

  @HostListener('mouseenter')
  show(): void {
    if (!this.isBrowser || this.tooltipDisabled() || !this.particleTooltip()) return;

    let positionStrategy = this.getPositionStrategy();

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        positionStrategy: positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        hasBackdrop: false
      });
    } else {
      positionStrategy = this.overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy;
    }

    if (!this.overlayRef.hasAttached()) {
      const tooltipPortal = new ComponentPortal(TooltipComponent);
      const componentRef = this.overlayRef.attach(tooltipPortal);

      componentRef.setInput('text', this.particleTooltip());

      this.positionSub.add(
        positionStrategy.positionChanges.subscribe(change => {
          const positionClass = this.getLogicalPositionClass(change.connectionPair);
          componentRef.setInput('position', positionClass);
        })
      );
    }
  }

  @HostListener('mouseleave')
  @HostListener('click')
  hide(): void {
    if (this.isBrowser) {
      this.closeTooltip();
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.closeTooltip();
      if (this.overlayRef) {
        this.overlayRef.dispose();
      }
    }
  }

  private closeTooltip(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
      this.positionSub.unsubscribe();
      this.positionSub = new Subscription(); // Reset for next open
    }
  }

  private updatePosition(): void {
    if (this.overlayRef) {
      this.overlayRef.updatePositionStrategy(this.getPositionStrategy());
    }
  }

  private getPositionStrategy(): FlexibleConnectedPositionStrategy {
    const positions: ConnectedPosition[] = this.getPositions(this.tooltipPosition());

    return this.positionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions(positions)
      .withPush(false)
      .withViewportMargin(8);
  }

  private getPositions(pos: string): ConnectedPosition[] {
    const top: ConnectedPosition = { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -this.TOOLTIP_OFFSET };
    const bottom: ConnectedPosition = { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: this.TOOLTIP_OFFSET };
    const left: ConnectedPosition = { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -this.TOOLTIP_OFFSET };
    const right: ConnectedPosition = { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: this.TOOLTIP_OFFSET };

    switch (pos) {
      case 'top': return [top, bottom, right, left];
      case 'left': return [left, right, top, bottom];
      case 'right': return [right, left, top, bottom];
      case 'bottom':
      default: return [bottom, top, right, left];
    }
  }

  private getLogicalPositionClass(pair: ConnectedPosition): 'top' | 'bottom' | 'left' | 'right' {
    if (pair.originY === 'top' && pair.overlayY === 'bottom') return 'top';
    if (pair.originY === 'bottom' && pair.overlayY === 'top') return 'bottom';
    if (pair.originX === 'start' && pair.overlayX === 'end') return 'left';
    if (pair.originX === 'end' && pair.overlayX === 'start') return 'right';
    return 'bottom';
  }

}
