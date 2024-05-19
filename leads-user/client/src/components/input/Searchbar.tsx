import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { AiOutlineSearch } from "react-icons/ai";

export default function Searchbar({ 
  setSearchTerm = (value:string) => null
}) {
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {

    const timeoutId = setTimeout(() => {
        setSearchTerm(debouncedSearch)
    }, 500)

    return () => {
        clearTimeout(timeoutId)
    }

}, [debouncedSearch])

  return (
    <InputGroup className='search-bar mt-6'>
        <Form.Control
            type='text'
            placeholder="Search..."
            onChange={(e) => setDebouncedSearch(e.target.value)}
        />
        <Button variant="search">
            <AiOutlineSearch size={18} />
        </Button>
    </InputGroup>
  )
}
