import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';

// ตัวอย่างสมมุติ endpoint เป็น SSE/stream
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  getMessageStream() {
    return httpResource<string[]>(() => ({
      url: 'https://example.com/api/chat/stream', // 👈 ต้องเป็น endpoint ที่รองรับ SSE/stream
      method: 'GET',
      streaming: true   // 👈 จุดสำคัญ Angular v20
    }));
  }
}
