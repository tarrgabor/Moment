import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DialogService {
  visible = new BehaviorSubject<boolean>(false);
  visible$ = this.visible.asObservable();
  callback: Function = () => {};
  label: string = "";
  confirmText: string = "";

  showDialog(label: string, confirmText: string, cb: Function)
  {
    this.visible.next(true);
    document.body.style.overflow = "hidden";
    this.label = label || "Dialog label";
    this.confirmText = confirmText || "Ok";
    this.callback = cb;
  }

  hideDialog()
  {
    this.visible.next(false);
    document.body.style.overflow = "auto";
  }

  confirm()
  {
    this.hideDialog();
    this.callback();
  }
}
