import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkinService {
  private apiUrl = 'https://bymykel.github.io/CSGO-API/api/en/skins.json';
  skins: any = [];
  skin: any = [];

  constructor(private http: HttpClient) {}

  getSkins(): Observable<any[]> {
    this.skins = this.http.get<any[]>(this.apiUrl);
    return this.skins
  }
  
  getSkinById(skinId: string): Observable<any> {
    return this.getSkins().pipe(
      map((skins: any[]) => skins.find((skin: any) => skin.id === skinId))
    );
  }
  
  generateSkinUrl(key: string, game: string, item_type: string, item_name: string, currency: string): string {

    let item_type_sanitized = encodeURIComponent(item_type);
    let item_name_sanitized = encodeURIComponent(item_name);
  
    let url_skin_page = 
      'https://www.steamwebapi.com/steam/api/items?key=' + key +
      '&game=' + game +
      '&item_type=' + item_type_sanitized +
      '&item_name=' + item_name_sanitized +
      '&currency=' + currency;
      
    return url_skin_page;
  }

  getSkinDetails(urlSkinPage: string): Observable<any[]> {
    this.skin = this.http.get<any[]>(urlSkinPage);
    return this.skin
  }
}