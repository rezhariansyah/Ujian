import React from 'react'
import Axios from 'axios'
import {urlApi} from '../support/urlApi'
import {connect} from 'react-redux'
import {setUserCart} from '../1.actions/userCartAction'
import CurrencyFormat from 'react-currency-format'
import swal from 'sweetalert'

class ProductDetail extends React.Component {
    state = {product : {}}

    componentDidMount(){
        this.getDataApi()
    }

    getDataApi = () => {
        var idUrl =  this.props.match.params.id
        Axios.get(urlApi + '/product/' + idUrl)
        .then((res) => {
            this.setState({product : res.data})
                console.log(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    qtyValidation = () => {
        var qty = this.refs.inputQty.value
        if (qty < 1) {
            this.refs.inputQty.value = 1
        }
    }

    getCartValue = () => {
        Axios.get(urlApi+'/cart')
        .then(res => this.props.setUserCart(res.data.length))
        .catch((err) => console.log(err))
    }

    onBtnAddToCart = () => {

        var newData = {
            username: this.props.obj,
            userId: this.props.id,
            namaProduk: this.state.product.nama,
            harga: this.state.product.harga,
            discount: this.state.product.discount,
            category: this.state.product.category,
            img: this.state.product.img,
            quantity : parseInt(this.refs.inputQty.value)
        }
    

        Axios.get(urlApi+'/cart?userId='+this.props.id+'&namaProduk='+newData.namaProduk)
                 .then((res) => {
                     var filterData = res.data.filter(data => data.namaProduk === newData.namaProduk);
                     if(filterData.length !== 0){
                         var quantity = filterData[0].quantity+newData.quantity
                         Axios.put(urlApi+'/cart/'+filterData[0].id,{...newData, quantity})
                             .then((res) =>{
                                 console.log(res)
                                 this.getCartValue();
                                 swal('Success', 'Item added to Cart', 'success')
                             })
                             .catch((err) => {
                                 console.log(err)
                             }) 
                     } else {
                         this.props.setUserCart(res.data.length);
                         Axios.post(urlApi+'/cart', newData)
                             .then((res) =>{
                                 console.log(res)
                                 this.getCartValue();
                                 swal('Success', 'Item added to Cart', 'success')
                             })
                             .catch((err) => {
                                 console.log(err)
                             })
                     }
                 })
         .catch((err) => console.log(err))
        
    }

    render(){
        var {nama, harga, discount, deskripsi, img} = this.state.product
        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="card" style={{width: '100%'}}>
                            <img src={img} className="card-img-top" alt="..." />
                            <div className="card-body">
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <h1 style={{color: '#4C4C4C'}}>{nama}</h1>
                        {
                            discount > 0 ?
                            <div style={{backgroundColor:'#D50000', 
                                        width:"50px" , height:"22px" , 
                                        color:'white', textAlign:"center",
                                        display:'inline-block'}}>{discount}%</div> 
                            : null
                        }
                        {
                            discount > 0 ? 
                            <CurrencyFormat value={harga} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} renderText={value => <span style={{fontSize:'12px',
                                                                                                                                                            fontWeight:'600',
                                                                                                                                                            color:'#606060' , 
                                                                                                                                                            marginLeft:'10px',
                                                                                                                                                            textDecoration:"line-through"}}>{value}</span>}/>
                            : null
                        }

                        <CurrencyFormat value={harga - (harga*(discount/100))} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} renderText={value => <div style={{fontSize:'24px',
                                                                                                                                                                                fontWeight : '700', 
                                                                                                                                                                                color:'#FF5722',
                                                                                                                                                                                marginTop:'20px'}}>{value} </div>}/>
                        
                        <div className="row">
                            <div className="col-md-2">
                                <div style={{marginTop: '15px',
                                        color: '#606060',
                                        fontWeight: '700',
                                        fontSize: '14px'
                                        }} >Jumlah</div>

                                <input type='number' defaultValue={1} onChange={this.qtyValidation} ref='inputQty' min={1} placeholder='1' className='form-control' style={{width: '60px',
                                                                                                                                            marginTop: '10px'}} />
                        </div>

                            <div className="col-md-6">
                                <div style={{marginTop: '15px',
                                            color: '#606060',
                                            fontWeight: '700',
                                            fontSize: '14px'
                                            }}>Catatan Untuk Penjual (Optional)</div>
                                <input type='text' style={{marginTop: '13px'}} placeholder='Contoh: Warna Putih, Ukuran XL, Edisi Kedua' className='form-control' />
                            </div>
                        </div>

                        <div className='row mt-4'>
                            <div className='col-md-8'>
                                <p style={{color: '#606060', fontStyle: 'italic'}}>
                                {deskripsi}
                                </p>
                            </div>
                        </div>

                        {this.props.obj === ""
                        ?
                        <div className='row mt-4'>
                            <input type='button' disabled className='btn border-secondary col-md-2 ml-3' value='Add to Wishlist'/>
                            <input type='button' disabled className='btn btn-primary col-md-3 ml-2' value='Buy Now'/>
                            <input type='button' disabled className='btn btn-success col-md-3 ml-2' value='Add to Cart'/>                            
                        </div>
                        :
                        <div className='row mt-4'>
                            <input type='button' className='btn border-secondary col-md-2 ml-3' value='Add to Wishlist'/>
                            <input type='button' className='btn btn-primary col-md-3 ml-2' value='Buy Now'/>
                            <input type='button' className='btn btn-success col-md-3 ml-2' onClick={() => this.onBtnAddToCart()} value='Add to Cart'/>                            
                        </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    var obj = state.user.username
    return {
        obj : obj,
        id: state.user.id
    }
}

export default connect(mapStateToProps,{setUserCart})(ProductDetail);