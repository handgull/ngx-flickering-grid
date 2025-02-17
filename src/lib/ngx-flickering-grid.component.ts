import {CommonModule, isPlatformBrowser} from "@angular/common";
import {AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, PLATFORM_ID, ViewChild,} from "@angular/core";

@Component({
  selector: "om-flickering-grid",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./ngx-flickering-grid.component.html",
  styleUrl: "./ngx-flickering-grid.component.scss",
})
export class NgxFlickeringGridComponent implements AfterViewInit, OnDestroy {
  @ViewChild("OmFlickeringGridBackground")
  background!: ElementRef<HTMLElement>;

  @ViewChild("OmFlickeringGridCanvas")
  canvas!: ElementRef<HTMLCanvasElement>;

  @Input("styleClass")
  styleClass?: string;

  @Input("squareSize")
  squareSize = 4;

  @Input("gridGap")
  gridGap = 6;

  @Input("flickerChance")
  flickerChance = 0.3;

  @Input("color")
  color = "#6B7280";

  @Input("maxOpacity")
  maxOpacity = 0.3;

  private intersectionObserver?: IntersectionObserver;

  private ctx!: CanvasRenderingContext2D;
  private cols: number = 0;
  private rows: number = 0;
  private squares?: Float32Array;
  private lastAnimationTime: number = 0;
  private animationFrameId?: number;
  private memoizedColor: string = "rgba(0, 0, 0,";

  private isInView = false;
  private animating = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {
  }

  ngAfterViewInit(): void {
    this.initCanvas();

    if (isPlatformBrowser(this.platformId)) {
      this.intersectionObserver = new IntersectionObserver(([entry]) => {
        this.renderContents(entry.isIntersecting);
      });
      this.intersectionObserver.observe(this.canvas.nativeElement);
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", () => this.setCanvasSize());

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  renderContents(isIntersecting: boolean) {
    if (isIntersecting && !this.isInView) {
      this.isInView = true;

      if (!this.animating) {
        this.animationFrameId = requestAnimationFrame((time) =>
          this.animateCanvas(time)
        );
      }
    } else if (!isIntersecting) {
      this.isInView = false;
    }
  }

  initCanvas(): void {
    this.setCanvasSize();
    this.setMemoizedColor();

    window.addEventListener("resize", () => this.setCanvasSize());

    if (!this.animating) {
      this.animationFrameId = requestAnimationFrame((time) =>
        this.animateCanvas(time)
      );
    }
  }

  setMemoizedColor(): void {
    if (typeof window === "undefined") {
      this.memoizedColor = `rgba(0, 0, 0,`;
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!ctx) {
      this.memoizedColor = `rgba(0, 0, 0,`;
      return;
    }

    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

    this.memoizedColor = `rgba(${r}, ${g}, ${b},`;
    return;
  }

  animateCanvas(time: number): void {
    if (!this.isInView) {
      this.animating = false;
      return;
    }

    this.animating = true;

    const deltaTime = (time - this.lastAnimationTime) / 1000;
    this.lastAnimationTime = time;

    this.updateSquares(deltaTime);
    this.drawGrid();
    this.animationFrameId = requestAnimationFrame((time) =>
      this.animateCanvas(time)
    );
  }

  setCanvasSize(): void {
    this.canvas.nativeElement.width =
      this.background.nativeElement.getBoundingClientRect().width;
    this.canvas.nativeElement.height =
      this.background.nativeElement.getBoundingClientRect().height;

    this.setupCanvas();

    this.ctx = this.canvas.nativeElement.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
  }

  setupCanvas(): void {
    this.cols = Math.ceil(
      this.canvas.nativeElement.width / (this.squareSize + this.gridGap)
    );
    this.rows = Math.ceil(
      this.canvas.nativeElement.height / (this.squareSize + this.gridGap)
    );

    this.squares = new Float32Array(this.cols * this.rows);
    for (let i = 0; i < this.squares.length; i++) {
      this.squares[i] = Math.random() * this.maxOpacity;
    }
  }

  updateSquares(deltaTime: number): void {
    if (!this.squares) {
      return;
    }

    for (let i = 0; i < this.squares.length; i++) {
      if (Math.random() < this.flickerChance * deltaTime) {
        this.squares[i] = Math.random() * this.maxOpacity;
      }
    }
  }

  drawGrid(): void {
    if (!this.squares) {
      return;
    }

    this.ctx.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    this.ctx.fillStyle = "transparent";
    this.ctx.fillRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );

    const [r, g, b] = this.ctx.getImageData(0, 0, 1, 1).data;

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const opacity = this.squares[i * this.rows + j];

        this.ctx.fillStyle = `${this.memoizedColor}${opacity})`;
        this.ctx.fillRect(
          i * (this.squareSize + this.gridGap),
          j * (this.squareSize + this.gridGap),
          this.squareSize,
          this.squareSize
        );
      }
    }
  }
}
