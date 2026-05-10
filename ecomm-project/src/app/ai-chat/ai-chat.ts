import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { AiService } from '../services/ai';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../services/product';

declare var window: any;

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.css'
})
export class AiChat {

  userMessage = '';
  messages: any[] = [];
  isChatOpen = false;
  isTyping = false;
  suggestions = [
    '🔥 Trending Rolex',
    '⌚ Premium Black Watches',
    '💎 Luxury Collection'
  ];

  useSuggestion(suggestion: string) {
    this.userMessage = suggestion;
    this.send();
  }
  isListening = false;
  recognition: any;

  constructor(private ai: AiService, private router: Router, private productService: ProductService, private cd: ChangeDetectorRef, private zone: NgZone) {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
          this.isListening = true;
        };

        this.recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          this.userMessage = transcript;
          this.send();
        };

        this.recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          this.isListening = false;
        };

        this.recognition.onend = () => {
          this.isListening = false;
        };
      }
    }
  }

  startListening() {
    if (this.recognition) {
      if (this.isListening) {
        this.recognition.stop();
      } else {
        this.recognition.start();
      }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  }

  speak(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }

  isLabelDismissed = false;

  dismissLabel(event: Event) {
    event.stopPropagation();
    this.isLabelDismissed = true;
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    this.isLabelDismissed = true;
  }

  async send() {

    if(!this.userMessage.trim()) return;

    const msg = this.userMessage;
    this.userMessage = '';

    this.messages = [...this.messages, {
      sender: 'user',
      text: msg
    }];

    this.isTyping = true;
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const userData = user ? JSON.parse(user) : null;
    const userId = userData?.id ?? userData?.userId;

    const botMsg: any = { sender: 'ai', text: '', searchQuery: msg, isDone: false };
    this.messages = [...this.messages, botMsg];
    
    // Force immediate UI update before starting async stream
    this.cd.detectChanges();

    this.ai.streamMessage(msg, userId).subscribe({
      next: (chunk) => {
        setTimeout(() => {
          this.isTyping = false; // Hide indicator once stream starts
          botMsg.text += chunk;
          this.messages = [...this.messages]; // Force UI update
        }, 0);
      },
      complete: () => {
        setTimeout(() => {
          botMsg.isDone = true;
          this.messages = [...this.messages]; // Force UI update
        }, 0);
        
        this.productService.productList().subscribe((products) => {
           const aiText = botMsg.text.toLowerCase();
           const mentionedProducts = products.filter(p => aiText.includes(p.name.toLowerCase()));
           if (mentionedProducts.length > 0) {
              setTimeout(() => {
                botMsg.searchQuery = 'ids:' + mentionedProducts.map(p => p.id).join(',');
                this.messages = [...this.messages]; // Force UI update
              }, 0);
           }
        });
      },
      error: (e) => {
        setTimeout(() => {
          this.isTyping = false;
          botMsg.text = 'Sorry, AI assistant abhi unavailable hai. Backend restart karke phir try karo.';
          botMsg.isDone = true;
          this.messages = [...this.messages]; // Force UI update
        }, 0);
      }
    });
  }

  showProducts(query: string) {
    if (query) {
      this.router.navigate(['/search', query]);
      this.isChatOpen = false;
    }
  }
}
