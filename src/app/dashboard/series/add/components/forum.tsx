"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import { TextareaAutosize  as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/material';
import { Select as BaseSelect, SelectProps, selectClasses } from '@mui/base/Select';
import { Option as BaseOption, optionClasses } from '@mui/base/Option';
import { Popper as BasePopper } from '@mui/base/Popper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  
  function InputFileUpload({label}: {label: string}) {
    return (
      <Button  style={{fontFamily:'Poppins'}} component="label" variant="contained" startIcon={<CloudUploadIcon />}>
        {label}
        <VisuallyHiddenInput type="file" />
      </Button>
    );
  }
import {
  Unstable_NumberInput as BaseNumberInput,
  NumberInputProps,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';

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
    
      onChange={(event, val) =>{ event.preventDefault();setValue(val)}}
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
function SelectMenu({label, options, def} : {label: string, options: string[], def: string} ) {

  console.log(options)
   const optionsElements = options.map((option) => <Option key={option} value={option}>{option}</Option>)
   console.log(optionsElements.length)
    return (
      <div className='w-full'>
        <Box  sx={{ mb: 2 }}>
          <Label htmlFor="unnamed-select">{label}</Label>
          <Select  id="unnamed-select">
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
    min-width: 320px;
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
function EmptyTextarea() {
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
  
    return <Textarea aria-label="empty textarea" placeholder="Description" />;
  }

export default function BasicTextFields() {
    const Field = styled(TextField)({
        '& label.Mui-focused': {
          color: 'green',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: 'green',
        },
        '& .MuiOutlinedInput-root': {
            borderRadius:'12px',
          '& fieldset': {
            borderColor: '#909090',
            borderWidth:'3px',
            transition:'all 0.35s ease-in-out'
          },
          '&:hover fieldset': {
            borderColor: '#c0c0c0',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#0352fc',
          },
          '& .MuiInputBase-input':{
                color:'white'
          },
          '& .MuiInputLabel-root':{
                color:'white'
          },
          '& .MuiInputLabel-root.Mui-focused':{
             color:'#0352fc !important'
          }
        },
    })
  return (
    <Box
      component="form"
      sx={{

        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      className='p-8 bg-[transparent] ] flex-col flex gap-10 justify-center items-center'
      noValidate
      autoComplete="off"
    >
      <div style={{width:'100%'}} className='w-full text-3xl text-center'><span>Enter Series Data</span></div>
      <div className='gap-10 flex flex-col' style={{width:'90%', maxWidth:'600px'}}>
       <div className='flex gap-4 justify-center'>
         <Field required sx={{flexGrow:1}} InputLabelProps={{style:{color:'white '}}} id="title-input" label="Title" variant="outlined"/>
         <Field sx={{flexGrow:1}} InputLabelProps={{style:{color:'white '}}} id="slug-input" label="URL slug" variant="outlined"/>
       </div>
       <div className='w-full flex'>
       <SelectMenu label='Genres' options={['hi', 'bye', 'welcome']} def='Select Genre'/>
       </div>
       <div>
        <EmptyTextarea />
       </div>
       <div className='flex gap-4 justify-center'>
         <Field sx={{flexGrow:1}} InputLabelProps={{style:{color:'white '}}} id="author-input" label="Author" variant="outlined"/>
         <Field sx={{flexGrow:1}} InputLabelProps={{style:{color:'white '}}} id="artist-input" label="Artist" variant="outlined"/>
       </div>
       <div className='flex flex-col gap-8'>
        <div >

       
        <div className='text-sm' style={{color:'#8c959f', paddingBottom:'5px', fontWeight:'400'}}>Rating</div>
        <NumberInput min={0} max={10} />
        </div>
        <div>
         <div className='text-sm' style={{color:'#8c959f', paddingBottom:'5px', fontWeight:'400'}}>Release Year</div>
         <NumberInput min={1990} max={new Date().getFullYear()} />
        </div>
        

       </div>
       <div className='flex justify-start w-full flex-col gap-1' style={{ width: '100%'}}>
        <div>Cover</div>
        <InputFileUpload label='Upload Cover' />
      </div>
      <div className='w-full flex flex-col gap-3'>
        <SelectMenu label='Status' options={['Hiatus', 'Completed', 'onGoing']} def='select status'/>
        <SelectMenu label='Visibility' options={['Visible', 'hidden']} def='select status'/>
        <SelectMenu label='Slider' options={['on', 'off']} def='select status'/>
        
      </div>
      <div className='flex justify-start w-full flex-col gap-1' style={{ width: '100%'}}>
        <div>Slider Banner</div>
        <InputFileUpload label="Upload Banner" />
      </div>
      </div>
      
      <div className='w-full flex justify-center' style={{width:'100%'}}>
        <Button className='flex gap-1 rounded-lg' sx={{fontFamily: 'Poppins', textTransform:'none'}} variant='contained'>
            Create Series
            <SendIcon />
        </Button>
      </div>
      
    </Box>
  );
}