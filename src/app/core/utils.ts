import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";


@Injectable({providedIn: 'root'})

export class Utils{

    constructor(private _sanitizer: DomSanitizer){}

    public ConvertImage(image: string){
        return this._sanitizer.bypassSecurityTrustResourceUrl(image) as string;
    }

}