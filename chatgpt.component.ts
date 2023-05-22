import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.css']
})

export class ChatgptComponent {

  @ViewChild('questionField', { static: false })
  textFieldRef!: ElementRef<HTMLInputElement>;

  apiUrl = 'https://api.openai.com/v1/completions'; // Replace with your OpenAI API endpoint
  apiKey = '<OPENAI API KEY>'; // Replace with your OpenAI API key
  response: string | undefined;
  textField: any;

  constructor(private http: HttpClient) { }

  answer: string = '';
  prompt_tokens: number = 0
  completion_tokens: number = 0
  total_tokens: number = 0
  total_cost: number = 0
  question: string = '';
  x: string = '';
  thinking: boolean = false
  text: string = 'Follow the yellow brick road';
  temp: number = 0
  responseLength: string = ' .Respond in one sentence.'

  getQuestion(x: any) { // appending the updated value to the variable
    this.question = x.target.value;
  }

  sendOpenAIRequest() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.apiKey}`);

    const requestBody = {
      model: "text-curie-001",
      prompt: this.question + this.responseLength,
      max_tokens: 250,
      temperature: this.temp,
    };

    this.http.post(this.apiUrl, requestBody, { headers })
      .subscribe((data: any) => {
        this.answer = data.choices[0].text;
        this.prompt_tokens = data.usage.prompt_tokens;
        this.completion_tokens = data.usage.completion_tokens;
        this.total_tokens = data.usage.total_tokens;
        this.total_cost = this.total_tokens * 0.0003

      }, (error) => {
        console.error('Error:', error);
      });
  }

  speak() {
    if (this.question) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(this.answer);
      synth.speak(utterance);
      console.log('Speech: ', this.answer)
    } else {
      console.error('Text-to-speech not supported in this browser.');
    }
  }

  clear() {
    const textField = this.textFieldRef.nativeElement;
    textField.value = '';
    this.question = '';
    this.answer = ''
    textField.focus();
  }

  setTemp(x: number) {
    this.temp = x
    console.log(this.temp)
  }

  setLength(x: string) {
    if (x == 'short') {
      this.responseLength = '. Respond in two or fewer sentences.'
      console.log('short')
    }
    if (x == 'intermediate') {
      this.responseLength = '. Respond in five or fewer sentences.'
      console.log('intermediate')
    }
    if (x == 'detailed') {
      this.responseLength = '. Respond in detail.'
      console.log('detailed')
    }
  }

}

