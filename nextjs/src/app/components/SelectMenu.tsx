

import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Option as BaseOption, optionClasses } from '@mui/base/Option';
import { Popper as BasePopper } from '@mui/base/Popper';
import { Select as BaseSelect, SelectProps, selectClasses } from '@mui/base/Select';
import { Box } from '@mui/material';

export default function SelectMenu({label, options, id, isMultiple, setValue, value} : {label: string, options: string[],  isMultiple: Boolean, id: string, setValue: Function, value:any} ) {

    console.log(options)
     const optionsElements = options.map((option) => <Option key={option} value={option}>{option}</Option>)
     console.log(optionsElements.length)
      return (
        <div className='w-full'>
          <Box  sx={{ mb: 2 }}>
            <Label htmlFor="unnamed-select">{label}</Label>
            <Select 
            value={value}
            onChange={(event, newValue) => {
                console.log(newValue)
                setValue(newValue)
            }}
            multiple={isMultiple? true : undefined}
            id={id}
           >
              {optionsElements}
            </Select>
          </Box>
        </div>
      );
    }
    
    const Select = React.forwardRef(function CustomSelect<
      TValue extends {},
      Multiple extends boolean,
    >(props: SelectProps<TValue, Multiple>, ref: React.ForwardedRef<HTMLButtonElement>) {
      const slots: SelectProps<TValue, Multiple>['slots'] = {
        root: styledButton,
        listbox: Listbox,
        popper: Popper,
        ...props.slots,
      };
    
      return <BaseSelect style={{border:'2px solid white', backgroundColor:'transparent'}} {...props} ref={ref} slots={slots} />;
    }) as <TValue extends {}, Multiple extends boolean>(
      props: SelectProps<TValue, Multiple> & React.RefAttributes<HTMLButtonElement>,
    ) => JSX.Element;
    
    const blue = {
      100: '#DAECFF',
      200: '#99CCF3',
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
    
    const styledButton = styled('button')(
      ({ theme }) => `
      width:'100%';
      font-family: IBM Plex Sans, sans-serif;
      font-size: 0.875rem;
      box-sizing: border-box;
      width:100%;
      padding: 8px 12px;
      border-radius: 8px;
      text-align: left;
      line-height: 1.5;
      background: ${grey[900]};
      border: 1px solid ${grey[700]};
      color: ${grey[300]};
      box-shadow: 0px 2px 6px ${'rgba(0,0,0, 0.50)'};
    
      transition-property: all;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 120ms;
    
      &:hover {
        background: ${grey[800]};
        border-color: ${grey[600]};
      }
    
      &.${selectClasses.focusVisible} {
        border-color: ${blue[400]};
        outline: 3px solid ${blue[500]};
      }
    
      &.${selectClasses.expanded} {
        &::after {
          content: '▴';
        }
      }
    
      &::after {
        content: '▾';
        float: right;
      }
      `,
    );
    
    const Listbox = styled('ul')(
      ({ theme }) => `
      width:'100%';
  
      display: flex;
      flex-direction: column;
     margin-bottom: 10px;
     gap:10px;
      padding-top:15px !important;
      padding-bottom:15px !important;
      font-family: IBM Plex Sans, sans-serif;
      font-size: 0.875rem;
      box-sizing: border-box;
      padding: 10px;
      margin: 12px 0;
      min-width: 320px;
      border-radius: 12px;
      overflow: auto;
      outline: 0px;
      background: ${grey[900]};
      border: 1px solid ${grey[700]};
      color: ${grey[300]};
      box-shadow: 0px 2px 6px ${'rgba(0,0,0, 0.50)' 
      };
      `,
    );
    
    const Option = styled(BaseOption)(
      ({ theme }) => `
      list-style: none;
      padding: 8px;
      
      border-radius: 8px;
      cursor: default;
    
      &:last-of-type {
        border-bottom: none;
      }
    
      &.${optionClasses.selected} {
        background-color: ${blue[900]};
        color: ${blue[100] };
      }
    
      &.${optionClasses.highlighted} {
        background-color: ${grey[800] };
        color: ${grey[300]};
      }
    
      &.${optionClasses.highlighted}.${optionClasses.selected} {
        background-color: ${blue[900]};
        color: ${blue[100]};
      }
    
      &.${optionClasses.disabled} {
        color: ${grey[700]};
      }
    
      &:hover:not(.${optionClasses.disabled}) {
        background-color: ${grey[800]};
        color: ${grey[900]};
      }
      `,
    );
    
    const Popper = styled(BasePopper)`
      z-index: 1;
    `;
    
    const Label = styled('label')(
      ({ theme }) => `
      font-family: IBM Plex Sans, sans-serif;
      font-size: 0.85rem;
      display: block;
      margin-bottom: 4px;
      font-weight: 400;
      color: ${grey[400]};
      `,
    );