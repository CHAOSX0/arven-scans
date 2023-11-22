import { TextareaAutosize  as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/material';

export default function TextareaAutoSize({id, value, setValue}:{id:string, value?: string, setValue?: Function}) {
    const blue = {
      100: '#DAECFF',
      200: '#b6daff',
      400: '#3399FF',
      500: '#007FFF',
      600: '#0072E5',
      900: '#003A75',
    };
  
    const grey = {
      50: '#f6f8fa',
      100: '#eaeef2',
      200: '#d0d7de',
      300: '#afb8c1',
      400: '#8c959f',
      500: '#6e7781',
      600: '#57606a',
      700: '#424a53',
      800: '#32383f',
      900: '#24292f',
    };
  
    const Textarea = styled(BaseTextareaAutosize)(
      ({ theme }) => `
      width: 100%;
      font-family: IBM Plex Sans, sans-serif;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.5;
      padding: 12px;
      border-radius: 12px 12px 0 12px;
      color: ${grey[300]};
      background: ${'transparent'};
      border: 2px solid ${'white'};
      box-shadow: 0px 2px 2px ${grey[900]};
  
      &:hover {
        border-color: ${blue[400]};
      }
  
      &:focus {
        border-color: ${blue[400]};
        box-shadow: 0 0 0 2px ${blue[500]};
      }
  
      // firefox
      &:focus-visible {
        outline: 0;
      }
    `,
    );
  
    return <Textarea id={id} aria-label="empty textarea" defaultValue={value}  placeholder="Description" />;
  }