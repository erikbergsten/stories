import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('load-spinner')
export class LoadSpinnerElement extends LitElement {

  render() {
    return html`
      <span class='loader'></span>
    `
  }
  static styles = css`
    :host {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .loader {
      width: 48px;
      height: 48px;
      border: 3px solid #555;
      border-radius: 50%;
      display: inline-block;
      position: relative;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }
    .loader::after {
      content: '';
      box-sizing: border-box;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 3px solid transparent;
      border-bottom-color: #FF3D00;
    }
    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `
}
