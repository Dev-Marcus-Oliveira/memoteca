import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PensamentoService } from './../pensamento.service';
import { Pensamento } from './../pensamento';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-listar-pensamento',
  templateUrl: './listar-pensamento.component.html',
  styleUrls: ['./listar-pensamento.component.css'],
})
export class ListarPensamentoComponent implements OnInit, OnDestroy {
  listaPensamentos: Pensamento[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private service: PensamentoService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarListaPensamentos();
    this.setupAutoReload();
  }

  private carregarListaPensamentos() {
    this.service.listar().subscribe((listaPensamentos) => {
      this.listaPensamentos = listaPensamentos;
    });
  }

  private setupAutoReload() {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.carregarListaPensamentos();
      });
    interval(10000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  criar(pensamento: Pensamento) {
    this.service.criar(pensamento).subscribe(() => {
      this.router.navigate(['/listarPensamento'], { replaceUrl: true });
    });
  }
}
