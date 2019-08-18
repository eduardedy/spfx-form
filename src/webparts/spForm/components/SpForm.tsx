import * as React from 'react';
import styles from './SpForm.module.scss';
import { ISpFormProps } from './ISpFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";

import jQuery from 'jquery'

export interface IRequestState {
  name: string;
  email: string;
  subject: string;
  message: string;
  FormDigestValue: string;
}

export default class SpForm extends React.Component<ISpFormProps, IRequestState> {

  constructor(props) {
    super(props)
    this.state = {
      name: this.props.fullName,
      email: this.props.email,
      subject: '',
      message: '',
      FormDigestValue: ''
    }
  }

  private getAccessToken(): void {
    return this.props.context.spHttpClient     //this.props.spHttpClient
      .post(
        this.props.siteUrl +
        // `/_api/web/lists/getByTitle('ContactList')/items`,
        `/_api/contextinfo`,
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then(data => {
        // console.log('api contextInfo: ', data)
        this.setState({ FormDigestValue: data.FormDigestValue })
      });
  }

  componentDidMount() {
    this.getAccessToken()
  }

  private handleChange = (e) => {
    const newState = {}
    newState[e.target.name] = e.target.value
    this.setState(newState)
  }

  private handleSubmit = (e: any) => {
    e.preventDefault()

    // let requestData = {
    //   __metadata:
    //   {
    //     type: "SP.Data.ContactListListItem"
    //   },
    //   Title: this.state.name,
    //   Email: this.state.email,
    //   Subject: this.state.subject,
    //   Message: this.state.message
    // };

    // if (requestData.Title.length < 1 || requestData.Email.length < 1 || requestData.Subject.length < 1 || requestData.Message.length < 1) {
    //   return false;
    // }

    // const spOpts: any = {
    //   body: requestData
    // };

    // jQuery.ajax({
    //   url: this.props.siteUrl + "/_api/web/lists/getByTitle('ContactList')/items",
    //   type: "POST",
    //   data: JSON.stringify(requestData),
    //   headers:
    //   {
    //     "Accept": "application/json;odata=verbose",
    //     "Content-Type": "application/json;odata=verbose",
    //     "X-RequestDigest": this.state.FormDigestValue,
    //     "IF-MATCH": "*",
    //     "X-HTTP-Method": "POST"
    //   },
    //   success: (data, status, xhr) => {
    //     alert("Submitted successfully");
    //     console.log(data)
    //   },
    //   error: (xhr, status, error) => {
    //     alert(JSON.stringify(xhr.responseText));
    //   }
    // });


    // ######################33

    const spOpts: ISPHttpClientOptions = {
      body: `{
         Title: '${this.state.name}' ,
         Email: '${this.state.email}' ,
         Subject: '${this.state.subject}' ,
         Message: '${this.state.message}' 
        }`
    };

    this.props.context.spHttpClient
      .post(
        `${this.props.siteUrl}/_api/web/lists/getByTitle('ContactList')/items`,
        SPHttpClient.configurations.v1,
        spOpts
      )
      .then((response: SPHttpClientResponse) => {
        // Access properties of the response object. 
        console.log(`Status code: ${response.status}`);
        console.log(`Status text: ${response.statusText}`);

        //response.json() returns a promise so you get access to the json in the resolve callback.
        response.json().then((responseJSON: JSON) => {
          console.log(responseJSON);
        });
      });

    this.setState({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

  }


  public render(): React.ReactElement<ISpFormProps> {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Contact IT Department</h1>
        <p>FormDigestValue: {}</p>
        <fieldset className={styles.formGroup}>
          <label htmlFor='formName' title='Full Name:' >Full Name:</label>

          <input id='formName' className='form-input' name='name' type='text' ref='formName' required onChange={this.handleChange} value={this.state.name} />
        </fieldset>

        <fieldset className={styles.formGroup}>
          <label htmlFor='formName' title='Full Name:' >Email:</label>
          <input id='formEmail' className='form-input' name='email' type='email' required onChange={this.handleChange} value={this.state.email} />
        </fieldset>

        <fieldset className={styles.formGroup}>
          <label htmlFor='formName' title='subject:' >subject:</label>

          <input id='formSubject' className='form-input' name='subject' type='text' required onChange={this.handleChange} value={this.state.subject} />
        </fieldset>

        <fieldset className={styles.formGroup}>
          <label htmlFor='formName' title='Full Name:' >Message:</label>

          <textarea id='formMessage' className='form-textarea' name='message' required onChange={this.handleChange}></textarea>
        </fieldset>

        <div className={styles.formGroup}>
          <input id='formButton' className={styles.btn} type='submit' placeholder='Send message' />
        </div>
      </form >
    );
  }
}
