import { fetchSessions, getDevtoolsInspectorURL } from './api';
import { addUrlHistoryListener, urlHistory } from './history';

const sessionsHTML = `
<button id="close-sessions">
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
</button>
<h2 style="display: none;">Current Sessions</h2>
<ol id="sessions-viewer" style="display: none;">
</ol>
<h2>Current History</h2>
<ol id="history-viewer">
</ol>
`;

export class Sessions {
  private onGotoUrlHandler = (_url: string) => {};
  private onCloseHandler = () => {};
  private $mount: HTMLElement;
  private $list: HTMLElement;
  private $history: HTMLElement;
  private interval: ReturnType<Window['setInterval']>

  constructor($mount: HTMLElement) {
    this.$mount = $mount;
    this.$mount.innerHTML = sessionsHTML;
    this.$list = document.querySelector('#sessions-viewer') as HTMLElement;
    this.$history = document.querySelector('#history-viewer') as HTMLElement;
    this.addListeners();
  }

  addListeners = () => {
    document.querySelector('#close-sessions')?.addEventListener('click', this.onCloseClick);
    this.$list.addEventListener('click', this.onClickList);
    this.$history.addEventListener('click', this.onClickHistory);
    addUrlHistoryListener(this.onHistoryChange);
  };

  removeListeners = () => {
    document.querySelector('#close-sessions')?.removeEventListener('click', this.onCloseClick);
    this.$list.removeEventListener('click', this.onClickList);
    this.$history.removeEventListener('click', this.onClickHistory);
    window.clearInterval(this.interval);
  };

  onCloseClick = () => {
    this.onCloseHandler();
  };

  onClickList = (e: any) => {
    const url = e.target.dataset.url;
    if (url) {
      this.gotoUrl(url);
    }
  };

  onClickHistory = (e: any) => {
    const url = e.target.dataset.url;
    if (url) {
      this.gotoUrl(url);
    }
  };

  toggleVisibility = (visible?: boolean) => {
    const display = (() => {
      if (typeof visible === 'boolean') {
        return visible ? 'flex' : 'none';
      }
      return this.$mount.style.display === 'flex' ? 'none' : 'flex';
    })();

    this.$mount.style.display = display;

    if (display === 'flex') {
      // this.getSessions();
      // this.interval = window.setInterval(this.getSessions, 2500);
    } else {
      window.clearInterval(this.interval);
    }
  }

  getSessions = async () => {
    const links = (await fetchSessions())
      .filter((s: any) => s.url !== 'about:blank')
      .map((s: any) => {
        return `<li>
                  <a href="${getDevtoolsInspectorURL(s.id)}" target="_blank" rel="noopener noreferrer nofollow">${s.title}</a>
                  <span data-url="${s.url}" style="cursor: pointer;">GOTO</span>
                </li>`;
      })
      .join('\n');
    this.$list.innerHTML = links;
  };


  onHistoryChange = () => {
    const history = urlHistory
      .map(({ url, title }: { url: string; title: string }) => {
        return `<li>
                <span data-url="${url}" style="cursor: pointer;">${title}</span>
              </li>`;
      })
      .join("\n");
    this.$history.innerHTML = history;
  };

  gotoUrl(url: string) {
    this.onGotoUrlHandler(url);
  }

  onGotoUrl = (handler: (url:string) => void) => this.onGotoUrlHandler = handler;
  onClose = (handler: () => void) => this.onCloseHandler = handler;
}
