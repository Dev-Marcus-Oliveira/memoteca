import { Pensamento } from './../pensamento';
import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as heartRegular } from '@fortawesome/free-regular-svg-icons';
import { PensamentoService } from '../pensamento.service';

@Component({
  selector: 'app-pensamento',
  templateUrl: './pensamento.component.html',
  styleUrls: ['./pensamento.component.css'],
})
export class PensamentoComponent implements OnInit {
  public heartSolid = heartSolid;
  public heartRegular = heartRegular;

  @Input() pensamento: Pensamento = {
    id: 0,
    conteudo: 'I love Angular',
    autoria: 'Nay',
    modelo: 'modelo3',
    favorito: false,
  };

  @Input() listaFavoritos: Pensamento[] = [];

  constructor(private service: PensamentoService) {}

  ngOnInit(): void {}

  larguraPensamento(): string {
    if (this.pensamento.conteudo.length >= 256) {
      return 'pensamento-g';
    }
    return 'pensamento-p';
  }

  atualizarFavoritos() {
    this.service.mudarFavorito(this.pensamento).subscribe(() => {
      this.listaFavoritos.splice(
        this.listaFavoritos.indexOf(this.pensamento),
        1
      );
    });
  }
}
