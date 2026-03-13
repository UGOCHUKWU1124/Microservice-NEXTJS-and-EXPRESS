"use client"

import styled from "styled-components";

interface BoxProps {
    css?: React.CSSProperties

}
const Box = styled.div.attrs<BoxProps
>((props) => ({
    style: props.css, //APPLY CSS PROPS AS INLINE STYLES
}))<BoxProps> `box-sizing: border-box;`;


export default Box;