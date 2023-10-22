"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';

type navElement = {
    text: string,
    URL?: string | undefined,
    isCurrent?: boolean,
    options?: {
        text: string,
        URL: string,
    }[] | undefined
}
function ELement({text, URL, options, isCurrent}: navElement){
    if(options){
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
          setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
          setAnchorEl(null);
        };
        return (
            <div>
                <Button
                sx={{
                    fontFamily:'Poppins !important',
                    textTransform:'none !important',
                    fontWeight:'600 !important',
                    padding:'0rem',
                    color: isCurrent ? '#f2f2f2' : "#909090"
                }}
                  id="basic-button"
                  className='text-lg'
               
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  {text}
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                    {options.map(option=> <MenuItem key={option.text}><Link href={option.URL}>{option.text}</Link></MenuItem>)}
                  
                </Menu>
              </div>
        )
    }else if(URL){
        return (
            <Link href={URL} style={{color: isCurrent ? '#f2f2f2 ': "#909090"} }>
                {text}
            </Link>
        )
    }
    
}
export default function DashboardNav({currentPage}: {currentPage: string}): JSX.Element{  
       const ElementsData  = [{text: 'Dashboard', URL:"/dashboard"}, {text: 'manga', URL: '/manga'}, {text: 'settings', options:[{text: 'site settings', URL: '/dashboard/settings/site settings'}]}]
       const Elements = ElementsData.map((element: navElement) => <ELement isCurrent={element.text == currentPage} key={element.text} {...element} />)
      
        return (
          <header>
            <nav className='flex gap-3 text-lg px-8 py-5 font-semibold'>
             {Elements}
            </nav>
          </header>
        );
    
}