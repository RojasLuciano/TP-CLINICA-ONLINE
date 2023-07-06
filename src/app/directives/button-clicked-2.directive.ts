import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appButtonClicked2]'
})
export class ButtonClicked2Directive {
  @Input('selected') selected: boolean | null = null;

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', 'blue');
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('lightblue');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('blue');
  }

  private highlight(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }
}
