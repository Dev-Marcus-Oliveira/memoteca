import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PensamentoService } from './../pensamento.service';
import { Pensamento } from './../pensamento';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-listar-pensamento',
  templateUrl: './listar-pensamento.component.html',
  styleUrls: ['./listar-pensamento.component.css'],
})
export class ListarPensamentoComponent implements OnInit, OnDestroy {
  public search = faSearch;
  private destroy$ = new Subject<void>();
  public listaPensamentos: Pensamento[] = [];
  public paginaAtual: number = 1;
  public haMaisPensamentos: boolean = true;
  public filtro: string = '';
  public favoritos: boolean = false;
  public listaFavoritos: Pensamento[] = [];
  public titulo: string = 'Meu Mural';

  constructor(private service: PensamentoService, private router: Router) {}

  ngOnInit(): void {
    this.carregarListaPensamentos();
    this.setupAutoReload();
  }

  carregarMaisPensamentos() {
    this.service
      .listar(++this.paginaAtual, this.filtro, this.favoritos)
      .subscribe((listaPensamentos) => {
        this.listaPensamentos.push(...this.listaPensamentos);
        if (!listaPensamentos.length) {
          this.haMaisPensamentos = false;
        }
      });
  }

  private carregarListaPensamentos() {
    this.service
      .listar(this.paginaAtual, this.filtro, this.favoritos)
      .subscribe((listaPensamentos) => {
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

  pesquisarPensamentos() {
    this.haMaisPensamentos = true;
    this.paginaAtual = 1;
    this.service
      .listar(this.paginaAtual, this.filtro, this.favoritos)
      .subscribe((listaPensamentos) => {
        this.listaPensamentos = listaPensamentos;
      });
  }

  recarregarComponente() {
    this.favoritos = false;
    this.paginaAtual = 1;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }

  listarFavoritos() {
    this.titulo = 'Meus Favoritos';
    this.favoritos = true;
    this.haMaisPensamentos = true;
    this.paginaAtual = 1;
    this.service
      .listar(this.paginaAtual, this.filtro, this.favoritos)
      .subscribe((listaPensamentosFavoritos) => {
        this.listaPensamentos = listaPensamentosFavoritos;
        this.listaFavoritos = listaPensamentosFavoritos;
      });
  }
}
