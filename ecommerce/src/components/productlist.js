import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import {urlApi} from '../support/urlApi'
import '../support/css/product.css'
import {setUserCart} from '../1.actions/userCartAction'
import swal from 'sweetalert'
import {connect} from 'react-redux'
import CurrencyFormat from 'react-currency-format'

class ProductList extends React.Component{
    state = {listProduct : []}

    componentDidMount(){
        this.getDataProduct()
    }

    getDataProduct = () => {
        axios.get(urlApi + '/product')
        .then((res)=> this.setState({listProduct : res.data}))
        .catch((err) => console.log(err))
    }

    getCartValue = () => {
        axios.get(urlApi+'/cart')
        .then(res => this.props.setUserCart(res.data.length))
        .catch((err) => console.log(err))
    }

    onBtnAddToCart = (data) => {    
        axios.get(urlApi+'/product?id='+ data.id)
         .then((res) => {
             var username = this.props.username
             var userId = this.props.id
             var namaProduk = res.data[0].nama
             var harga = res.data[0].harga
             var discount = res.data[0].discount
             var category = res.data[0].category
             var img = res.data[0].img

             var newData = {
                 username, userId, namaProduk,
                 harga, discount, category, img
             }
             axios.get(urlApi+'/cart?userId='+this.props.id+'&namaProduk='+newData.namaProduk)
                 .then((res) => {
                     console.log(res)
                     if(res.data.length > 0){
                         var quantity = res.data[0].quantity+1
                         axios.put(urlApi+'/cart/'+res.data[0].id,{...newData, quantity})
                             .then((res) =>{
                                 console.log(res);
                                 this.getCartValue()
                                 swal('Success', 'Item added to Cart', 'success')
                             })
                             .catch((err) => {
                                 console.log(err)
                             }) 
                     } else {
                         axios.post(urlApi+'/cart', {...newData, quantity : 1})
                             .then((res) =>{
                                 console.log(res);
                                 this.getCartValue()
                                 swal('Success', 'Item added to Cart', 'success')
                             })
                             .catch((err) => {
                                 console.log(err)
                             })
                     }
                 })
         })
         .catch((err) => console.log(err))
 }

    renderProdukJsx = () => {
        var jsx = this.state.listProduct.map((val) => {
            // if(val.nama.toLowerCase().includes(this.props.search.toLowerCase())) { //Transfer dari Parents ke Child
            return (
                <div className="card col-md-3 mr-5 mt-3" style={{width: '100%'}}>
                    <Link to = {'/product-detail/' + val.id} ><img src={val.img} height="250px" className="card-img-top" alt="image product" /></Link>
                    
                    {   
                        val.discount > 0 ?
                        <div className="discount">{val.discount}%</div>
                        : null
                    }
                    
                    <div className="card-body">
                    <h4 className="card-text">{val.nama}</h4>

                    {
                        val.discount > 0 ?
                        <CurrencyFormat value={val.harga} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} renderText={value => <p className="card-text mr-3" style={{textDecoration:'line-through', color:'red', display:'inline'}}>{value}</p>}/>
                        : null
                    }

                    <CurrencyFormat value={val.harga - (val.harga*(val.discount/100))} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} renderText={value => <p className="card-text mr-5" style={{display:'inline',fontWeight:'700'}}>{value}</p>}/>
                    {this.props.username === ""
                    ?
                    <Link to="/login"><input type="button" className="d-block btn btn-success mt-2" value="Add to Cart"/></Link>                    
                    :
                    
                    <input type="button" className="d-block btn btn-success mt-2" onClick={() => this.onBtnAddToCart(val)} value="Add to Cart"/>
                    }
                    </div>
                    
                </div>
            )
            // }
        })
        return jsx
    }

    render(){
        return(
            <div className='container'>
                <div className='row justify-content-center'>
                    {this.renderProdukJsx()}   
                </div>                
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      role : state.user.role,
      username: state.user.username,
      id: state.user.id,
    }  
  }

export default connect(mapStateToProps,{setUserCart})(ProductList)