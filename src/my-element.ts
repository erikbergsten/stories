import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { parse } from 'yaml';
import './spinner.ts'
import './icons.ts'

type Task = {
  name: string
  description?: string
  status: string
}

type UserStory = {
  name: string
  description?: string
  tags: string[]
  tasks: Task[]
}

// TODO: type guard T
const fetchYaml = <T,>(path: string): Promise<T> =>
  fetch(path)
    .then(res => {
      const contentType =  res.headers.get('Content-Type') ?? ""
      if(contentType.endsWith('json') || contentType.endsWith('yaml')) {
        return res.text()
      } else {
        throw new Error(`fetch ${path}: Unacceptable content type: ${contentType}`)
      }
    })
    .then(text => (parse(text) as unknown as T))
    /*
    .then((value: T) => new Promise((resolve, _reject) =>
      setTimeout(() => resolve(value), 2500)
    ))
    */

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('user-story')
export class UserStoryElement extends LitElement {

  @property({ type: String })
  path: string = "<path undefined>"

  @property({ type: String, attribute: false })
  error?: string

  @property({ type: Object, attribute: false })
  story?: UserStory

  connectedCallback() {
    super.connectedCallback()
    fetchYaml<UserStory>(this.path)
      .then((story: UserStory) => {
        console.log("got story:", story);
        this.story = story
      })
      .catch(e => {
        this.error = `Unable to fetch story: ${e.toString()}`;
      })
  }

  renderTask(task: Task) {
    return html`
      <li class='task'>
        <h4> ${ task.name } </h4>
        <p
          contentEditable='true'
          id='${task.name}-description'
          @input=${() => task.description = this.shadowRoot?.getElementById(`${task.name}-description`)?.innerText}
        >
          ${ task.description }
        </p>
        <span> ${ task.status } </span>
      </li>
    `;
  }

  // TODO: markdown renderer for description
  render() {
    if(this.error !== undefined) {
      return html`<span class='error'> ${this.error} </span>`
    } else if(this.story) {
      return html`
        <h3> ${ this.story.name } </h3>
        <ul class='tags'>
          ${ this.story.tags.map((tag: string) => html`<li>${tag}</li>`) }
        </ul>
        <pre
          contentEditable='true'
          class='description'
        >${ this.story.description }</pre>
        <h4> Tasks </h4>
        <ul class='tasks'>
          ${ this.story.tasks.map(this.renderTask.bind(this)) }
        </ul>
      `
    } else {
      return html`
        <load-spinner></load-spinner>
      `;
    }
  }

  static styles = css`
    :host {
      padding: 1rem;
      border: 1px solid black;
      display: block;

    }
    h3 {
      font-size: 1.5rem;
      margin: 0;
    }

    .tags {
      list-style-type: none;
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      padding: 0.25rem 0;
      margin: 0;
      li {
        border-radius: 5px;
        background-color: #edf;
        padding: 0.25rem 0.5rem;
      }
    }

    .description {
      font-family: var(--monospace-font);
      margin: 0;
      color: #444;
    }

    .tasks {
      li {
        h4 {
          font-weight: normal;
          margin: 0;
        }
        p {
          font-style: italic;
          color: #888;
          margin: 0;
        }
        p[contenteditable="true"] {
          text-decoration: underline;
          text-decoration-style: dashed;
        }
        span {
          font-weight: bold;
          color: #666;
          font-size: 0.8rem;
          margin: 0;
        }
      }
    }

    .error {
      color: red;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'user-story': UserStoryElement
  }
}
