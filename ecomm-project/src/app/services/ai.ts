import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  apiUrl = `${environment.apiUrl}/ai/chat`;

  constructor(private http: HttpClient) { }

  streamMessage(message: string, userId ?: string | number): Observable < string > {
  return new Observable(observer => {
    fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, userId })
    }).then(async response => {
      if (!response.body) {
        observer.error(new Error('ReadableStream not yet supported in this browser.'));
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            observer.complete();
            break;
          }
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('data: ')) {
              const dataStr = trimmedLine.slice(6).trim();
              if (dataStr === '[DONE]') {
                observer.complete();
                return;
              }
              try {
                const data = JSON.parse(dataStr);
                if (data.text) {
                  observer.next(data.text);
                }
              } catch (e) { }
            }
          }
        }
      } catch (err) {
        observer.error(err);
      }
    }).catch(err => {
      observer.error(err);
    });
  });
}
}
