import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importa o CommonModule

import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'], // Corrige o nome da propriedade de styleUrl para styleUrls
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  skins: any[] = [];
  page: number = 1;
  loading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loading = true;
    this.http.get('https://bymykel.github.io/CSGO-API/api/en/skins.json').subscribe((data: any) => {
      if (data) {
        this.skins = data;
        console.log(data)
        this.loading = false;
      } else {
        console.error('Dados inválidos recebidos da API:', data);
      }
    });
  }

  // Função para abrir a página específica das skins
  returnSkinPage(key: string, game: string, item_type: string, item_name: string, currency: string): string {
    let item_type_encoded = encodeURIComponent(item_type);
    let item_name_encoded = encodeURIComponent(item_name);
    let url_skin_page = 'https://www.steamwebapi.com/steam/api/items?key='+key+
                        '&game='+game+
                        '&item_type='+item_type_encoded+
                        '&item_name='+item_name_encoded+
                        '&currency='+currency;
    return url_skin_page;                    
  }
}
