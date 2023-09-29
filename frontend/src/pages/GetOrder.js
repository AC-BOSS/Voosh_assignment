import React, {useEffect, useState} from "react";

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import {useNavigate} from 'react-router-dom';

export default function GetOrder() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    function getCookie(key) {
        var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
        return b ? b.pop() : "";
    }

    useEffect(() => {
        async function getOrders(){
            const accessToken = getCookie('accessToken');
            console.log(accessToken);
            if(!accessToken) {
                navigate("/login");
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/order/get-order`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken
                }
            })
            const data = await response.json();
            console.log(data);
            setOrders(data);
        }
        getOrders();
    }, []);

    const Item = styled(Paper)(() => ({
        backgroundColor: '#98d6a9',
        padding: 8,
        textAlign: 'center',
        color: 'black',
      }));

    return(
        <>
        <CssBaseline>
        <Container>
        <Box sx={{ m: 2 }}>
            <Grid container spacing={4}>

                {
                    orders.map((order) => {
                        return (
                            <Grid item xs={12} key={order._id}>
                                <Item elevation={3}>Sub Total: {order.sub_total} &emsp;&emsp;&emsp;&emsp; Phone: {order.phone}</Item>
                            </Grid>
                        )
                    })
                }

            </Grid>
        </Box>
        </Container>
        </CssBaseline>
        </>
    )
}