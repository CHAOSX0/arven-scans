import {
    Unstable_NumberInput as BaseNumberInput,
    NumberInputProps,
    numberInputClasses,
  } from '@mui/base/Unstable_NumberInput';
    import { styled } from '@mui/material/styles';
    import * as React from 'react';

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

const NumberInput = React.forwardRef(function CustomNumberInput(
    props: NumberInputProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    return (
      <BaseNumberInput
      
        slots={{
          root: StyledInputRoot,
          input: StyledInputElement,
          incrementButton: StyledButton,
          decrementButton: StyledButton,
        }}
        slotProps={{
          incrementButton: {
              type:'button',
              onClick: (event) => event.preventDefault(),
            children: '▴',
          },
          decrementButton: {
              type:'button',
              onClick: (event) => event.preventDefault(),
            children: '▾',
          },
        }}
        //onChange={(event, val) =>{ console.log('change');event.preventDefault();setValue(val)}}

        {...props}
        ref={ref}
      />
    );
  });
  
  function NumberInputBasic() {
    const [value, setValue] = React.useState<number | undefined>();
    return (
      <NumberInput
        aria-label="Demo number input"
        placeholder="Type a number…"
        value={value}
    
      />
    );
  }
  
  const StyledInputRoot = styled('div')(
    ({ theme }) => {
      theme.palette.mode = 'dark';
      return `
    font-family: IBM Plex Sans, sans-serif;
    font-weight: 400;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? 'transparent' : '#fff'};
    border: 2px solid white;
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    display: grid;
    grid-template-columns: 1fr 19px;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
  
  
    &.${numberInputClasses.focused} {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 2px ${theme.palette.mode === 'dark' ? blue[500] : blue[200]};
    }
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `});
  
  const StyledInputElement = styled('input')(
    ({ theme }) => `
    background: transparent;
    font-size: 0.875rem;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.5;
    grid-column: 1/2;
    grid-row: 1/3;
    color: ${grey[300]};
    background: inherit;
    border: none;
    border-radius: inherit;
    padding: 8px 12px;
    outline: 0;
  `,
  );
  
  const StyledButton = styled('button')(
    ({ theme }) => `
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    appearance: none;
    padding: 0;
    width: 19px;
    height: 19px;
    font-family: system-ui, sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    line-height: 1.2;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 0;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
      cursor: pointer;
    }
  
    &.${numberInputClasses.incrementButton} {
      grid-column: 2/3;
      grid-row: 1/2;
    }
  
    &.${numberInputClasses.decrementButton} {
      grid-column: 2/3;
      grid-row: 2/3;
    }
  `,
  );

  export default NumberInput;