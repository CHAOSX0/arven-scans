"use client";

import { useEffect, useState } from 'react'
import Select from 'react-select'


export default function SearchSelect({getValues, isMulti}: {getValues: ()=>Promise<{label: string, value: string}[]>, isMulti: boolean}){
    const [options, SetOptions]= useState<{value: string, label: string}[]>([])
    const [values, setValues]= useState<{value: string, label: string}[]>([])
    useEffect(()=>{
       getValues().then(res=>{
          SetOptions(res)
       })
    }, [])
    return (
        <Select name='select'  isMulti={isMulti} options={options} styles={{
           singleValue: base=>({...base, color: 'white'}),
            menu: base => ({
              ...base, zIndex: 9999, color: 'var(--text-color)', backgroundColor: 'var(--background)', "&:hover": {

              }
            }),
            menuList: (base, state) => ({
              ...base,
              backgroundColor: '#222223',
            }),
            container: (base, props) => ({
              ...base,
              '&:hover': {

              },
              "&:focus": {
                display: 'none'
              }
            }),
            control: (base, state) => ({
              ...base,
              border: state.isFocused ? '1.5px solid var(--border-color)' : '1.5px solid var(--border-color)',
              boxShadow: 'none',
              color: 'var(--text-color)',
              backgroundColor: 'var(--background)',
              "&:hover": {
                backdropFilter: 'invert(70%)',
                backgroundColor: 'var(--background)'
              }
            }),
            multiValueLabel: base => ({
              ...base,
              color: 'var(--text-color)',
            }),
            multiValueRemove: base => ({
              ...base,
              padding: '0',
              margin: '0',
              '&:hover': {
                color: 'var(--text-color)',
                backgroundColor: 'transparent'
              }
            }),
            indicatorsContainer: base => ({
              ...base,
              displat: 'none'
            }),
            option: base => ({
              ...base,
              backgroundColor: '#222223',
              '&:focus': {

                backgroundFilter: 'invert(70%)'

              },
              '&:hover': {
                backgroundColor: '#495c68'
              }
            }),
            multiValue: base => ({
              ...base,
              display: 'flex',
              flexDirection: 'row-reverse',
              gap: '-2px',
              paddingTop: '2px',
              paddingBottom: '2px',
              paddingRight: '5px',
              paddingLeft: '5px',
              borderRadius: '10px',
              border: '1.5px solid var(--border-color)',
              backgroundColor: 'transparent',
              color: 'var(--text-color)',
              margin: '5px'

            })
          }} />
    )
}