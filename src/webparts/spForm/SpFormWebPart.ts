import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'SpFormWebPartStrings';
import SpForm from './components/SpForm';
import { ISpFormProps } from './components/ISpFormProps';

export interface ISpFormWebPartProps {
  description: string;
}

export default class SpFormWebPart extends BaseClientSideWebPart<ISpFormWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISpFormProps> = React.createElement(
      SpForm,
      {
        description: this.properties.description,
        fullName: this.context.pageContext.user.displayName,
        email: this.context.pageContext.user.email,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }




}
