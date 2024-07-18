import { ValueTransformer } from 'typeorm';

class JsonColumn implements ValueTransformer {
  to(value: any): any {
    return JSON.stringify(value);
  }

  from(value: any): any {
    try {
      return JSON.parse(value || '{}');
    } catch (error) {
      console.error(`Error parsing JSON column: ${error.message}`);
      return {};
    }
  }
}

export default JsonColumn