import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Axios from 'axios';
import {Button, Icon, Input, Label} from 'semantic-ui-react'
import { urlApi } from '../support/urlApi';
import swal from 'sweetalert';
import {connect} from 'react-redux';
import PageNotFound from '../components/pageNotfound';
import CurrencyFormat from 'react-currency-format';
import cookie from 'universal-cookie';
import {setUserCart} from '../1.actions/userCartAction';
import { countcart } from '../1.actions';
import {Link} from 'react-router-dom';

const Cookies = new cookie()
const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class CustomPaginationActionsTable extends React.Component {
  state = {
    rows: [],
    page: 0,
    rowsPerPage: 5,
    isEdit: false,
    editItem : {}
  };

  componentDidMount(){
    var cookie = Cookies.get('userData')
    this.getDataApi(cookie)
  }

  getDataApi = () => {
      Axios.get(urlApi + '/cart?username=' + this.props.username)
      .then((res) => {
        this.setState({rows : res.data})
        var a = this.state.rows.length
        this.props.countcart(a)
      }
      )
      .catch((err) => console.log(err))
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  onBtnDelete = (id) => {
    Axios.delete(urlApi + '/cart/' + id)
    .then((res) => {
      var cookie = Cookies.get('userData')
        this.getDataApi(cookie)
        this.getCartValue()
        swal("Delete Success", "Product is Delete", "success")
        
    })
    .catch((err) => console.log(err))
    
  }


  qtyValidation = () => {
    var qty = this.refs.editValue.value
    if (qty < 1) {
        this.refs.editValue.value = 1
    }
}

  renderJsx = () => {
    var jsx = this.state.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
    .map((val,index) => {
      
        return(
            <TableRow key={val.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell component="th" scope="row">
                  {val.namaProduk}
              </TableCell>
              <TableCell><img src={val.img} height='50px'/></TableCell>
              
              <TableCell>
                {this.state.editItem === index && this.state.isEdit === true ? (
                <input type='number' onChange={this.qtyValidation} min={1} className='form-control' ref='editValue' defaultValue={val.quantity} style={{width:'70px'}}/>
                ) : val.quantity}
              </TableCell>
              <TableCell>  
                <CurrencyFormat value={val.harga - (val.harga*(val.discount/100))} displayType={'text'} thousandSeparator={true} prefix={'Rp. '}/>
              </TableCell>
              <TableCell>
                  <Button 
                  animated 
                  color= {this.state.isEdit === true && this.state.editItem === index ? 'green' : 'blue'}
                  onClick={() => 
                    this.state.isEdit === true && this.state.editItem === index ? this.onBtnSave(index) : this.onBtnEditClick(index)}>
                  <Button.Content visible>
                    {
                      this.state.isEdit === true && this.state.editItem === index ? 'Save' : 'Edit'
                    }
                  </Button.Content>
                  <Button.Content hidden>
                    {
                      this.state.isEdit === true && this.state.editItem === index ? <Icon name='save' /> : <Icon name='edit' />
                    }
                  </Button.Content>
                  </Button>
                  <Button 
                  animated 
                  color='red' 
                  onClick={() => 
                    this.state.isEdit === true && this.state.editItem === index ? this.onBtnCancel() : this.onBtnDelete(val.id)}>
                  <Button.Content visible>
                    {
                      this.state.isEdit === true && this.state.editItem === index ? 'Cancel' : 'Delete'
                    }
                  </Button.Content>
                  <Button.Content hidden>
                      <Icon name='delete' />
                  </Button.Content>
                  </Button>
              </TableCell>
        </TableRow>
        )
    })
    return jsx
  }

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };
  
  onBtnEditClick = (param) => {
    this.setState({isEdit: true, editItem: param})
  }

  onBtnCancel = () => {
    this.setState({ isEdit: false,editItem : {}})
  }

  onBtnSave = (param) => {
    var username = this.props.username
    var userId = this.props.id
    var namaProduk = this.state.rows[param].namaProduk
    var harga = this.state.rows[param].harga
    var discount = this.state.rows[param].discount
    var category = this.state.rows[param].category
    var img = this.state.rows[param].img
    var quantity = this.refs.editValue.value === "" ? this.state.rows[param].quantity : this.refs.editValue.value
    var cookie = Cookies.get('userData')

    var NewData = {username, userId, namaProduk , harga : parseInt(harga) , discount : parseInt(discount) , category , img , quantity : parseInt(quantity)}
    Axios.put(urlApi + '/cart/' +this.state.rows[param].id,NewData)
      .then((res) => {
          this.getDataApi(cookie)
          swal("Edit Success", "Product has been edited", "success")
          this.setState({isEdit : false , editItem : {}})
      })
      .catch((err) => {
        console.log(err.response)
      })
  } 

  getTotalHarga = ()=>{
    var harga=0
     for (var i=0;i<this.state.rows.length;i++){
        harga += parseInt((this.state.rows[i].harga - (this.state.rows[i].harga *this.state.rows[i].discount/100))*this.state.rows[i].quantity)
     }
     return harga
   }

   getCartValue = () => {
    Axios.get(urlApi+'/cart')
    .then(res => this.props.setUserCart(res.data.length))
    .catch((err) => console.log(err))
}

   checkOut = () => {
    Axios.get(urlApi+'/cart?user_id='+this.props.id)
    .then((res) => {
      console.log(res)
      const newData = {
        date: new Date(),
        userId: res.data[0].id,
        listCart: res.data
      }
      for(var i=0; i < res.data.length; i++) {
        Axios.delete(urlApi + '/cart/' + res.data[i].id)
        .then ((res)=>{
          console.log(res)
          
        })
        .catch((err)=>{
          console.log(err)
        })
      }
      
        Axios.post(urlApi + '/history', newData)
        .then ((res) => {
          console.log(res)
          swal('Success', 'Transaksi Sukses', 'success')
          this.getDataApi(this.props.username)
          this.getCartValue()
        })
        .catch((err)=>{
          console.log(err)
        })
    })
    .catch((err)=>{
      console.log(err)
    })
   }

  render() {
    const { classes } = this.props;
    const { rows, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    var {nama, harga, discount, deskripsi, img, category} = this.state.editItem
    if (this.props.role === 'user')
    {
    return (
        <div className="container">
            <Paper className={classes.root}>
            <div className={classes.tableWrapper}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontSize:'15px', fontWeight:'600'}}>NO.</TableCell>
                        <TableCell style={{fontSize:'15px', fontWeight:'600'}}>ITEM</TableCell>
                        <TableCell style={{fontSize:'15px', fontWeight:'600'}}>VIEW</TableCell>
                        <TableCell style={{fontSize:'15px', fontWeight:'600'}}>QTY</TableCell>
                        <TableCell style={{fontSize:'15px', fontWeight:'600'}}>PRICE</TableCell>
                        <TableCell style={{fontSize:'15px', fontWeight:'600'}}>ACT</TableCell>
                    </TableRow>       
                </TableHead>
                <TableBody>
                {this.renderJsx()}
            
                {emptyRows > 0 && (
                    <TableRow style={{ height: 48 * emptyRows }}>
                    <TableCell colSpan={6} />
                    </TableRow>
                )}
                </TableBody>
                <TableFooter>
                <TableRow>
                    <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={3}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                        native: true,
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActionsWrapped}
                    />
                </TableRow>
                </TableFooter>
            </Table>
            </div>
        </Paper>
        <div className='mt-5 row'>
          <div className='col-md-auto'>
          { this.props.countcart === 0
            ?
            <TableCell colSpan={5}><CurrencyFormat displayType={'text'} thousandSeparator={true}/>anda tidak memiliki keranjang</TableCell>     
            :
            <TableCell colSpan={5}><CurrencyFormat value={this.getTotalHarga()} displayType={'text'} thousandSeparator={true} prefix={'Total Harga : Rp. '}/></TableCell>
          }            
            <TableCell colSpan={1} style={{paddingRight:"0px"}}>
              <Button animated color ='teal' onClick={this.checkOut}>
                  <Button.Content visible >Check Out </Button.Content>
                  <Button.Content hidden>
                      <Icon name='cart' />
                  </Button.Content>
                  </Button>
            </TableCell>

            <TableCell>
            <Link to='/'><Button animated color ='red'>
                  <Button.Content visible >Continue Shopping </Button.Content>
                  <Button.Content hidden>
                      <Icon name='cart' />
                  </Button.Content>
                  </Button></Link>
            </TableCell>
          </div>
        </div>
        </div>      
    );
    } 
    return <PageNotFound/>
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    role : state.user.role,
    username: state.user.username,
    id: state.user.id
  }  
}

export default connect(mapStateToProps, {setUserCart,countcart})(withStyles(styles)(CustomPaginationActionsTable));