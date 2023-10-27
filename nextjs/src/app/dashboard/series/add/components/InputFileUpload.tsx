import { styled } from '@mui/material';
import Button from '@mui/material/Button';
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
  
  export default function InputFileUpload({label, id}: {label: string, id: string}){
    return (
      <Button onClick={()=>{
         const input = document.getElementById(id) as HTMLInputElement;
         if(input){
            const file = input?.files?.[0];
            console.log(file, 'file')
         }
         
      }}  style={{fontFamily:'Poppins'}} component="label" variant="contained" startIcon={<CloudUploadIcon />}>
        {label}
        <VisuallyHiddenInput
            accept="image/*"
            id={id}
         type="file" />
      </Button>
    );
  }