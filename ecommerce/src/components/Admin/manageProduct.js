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
import { urlApi } from '../../support/urlApi';
import swal from 'sweetalert'
import {connect} from 'react-redux'
import PageNotFound from '../pageNotfound'

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
    this.getDataApi()
  }

  getDataApi = () => {
      Axios.get(urlApi + '/product')
      .then((res) => this.setState({rows : res.data}))
      .catch((err) => console.log(err))
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  onBtnDelete = (id) => {
    Axios.delete(urlApi + '/product/' + id)
    .then((res) => {
        this.getDataApi()
    })
    .catch((err) => console.log(err))
  }

  renderJsx = () => {
    var jsx = this.state.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
    .map((val) => {
        return(
            <TableRow key={val.id}>
                    <TableCell>{val.id}</TableCell>
                    <TableCell component="th" scope="row">
                        {val.nama}
                    </TableCell>
                    <TableCell>Rp. {val.harga}</TableCell>
                    <TableCell>{val.discount}%</TableCell>
                    <TableCell>{val.category}</TableCell>
                    <TableCell><img src={val.img} height='50px'/></TableCell>
                    <TableCell>{val.deskripsi}</TableCell>
                    <TableCell>
                        <Button animated color='blue' onClick={() => this.onBtnEditClick(val)}>
                        <Button.Content visible>Edit</Button.Content>
                        <Button.Content hidden>
                            <Icon name='edit' />
                        </Button.Content>
                        </Button>
                        <Button animated color='red' onClick={() => this.onBtnDelete(val.id)} >
                        <Button.Content visible>Delete</Button.Content>
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

  onBtnAdd = () => {
    var namaproduk = this.nama.inputRef.value
    var harga = parseInt(this.harga.inputRef.value)
    var discount = parseInt(this.discount.inputRef.value)
    var category = this.category.inputRef.value
    var img = this.img.inputRef.value
    var deskripsi = this.deskripsi.inputRef.value

    // properti harus sesuai dengan db.json
    // var newData = {
    //   nama : namaproduk,
    //   harga,
    //   discount,
    //   category,
    //   img,
    //   deskripsi
    // }

    Axios.post (urlApi + '/product', {nama : namaproduk, harga, discount, category, img, deskripsi})
    .then((res) => {
      swal('Add Product', 'Add Product Success', 'success',)
      this.getDataApi()
    })
    .catch((err) => {
      console.log(err)})
      
      this.nama.inputRef.value = ''
      this.harga.inputRef.value =''
      this.discount.inputRef.value = ''
      this.category.inputRef.value = ''
      this.img.inputRef.value = ''
      this.deskripsi.inputRef.value = ''
  }

  onBtnEditClick = (param) => {
    this.setState({isEdit: true, editItem: param})
  }

  onBtnCancel = () => {
    this.setState({isEdit: false, editItem: {}})
  }

  onBtnSave = () => {
    var namaproduk = this.namaEdit.inputRef.value === "" ? this.state.editItem.nama : this.namaEdit.inputRef.value
    var harga = this.hargaEdit.inputRef.value === "" ? this.state.editItem.harga : this.hargaEdit.inputRef.value
    var discount = this.discountEdit.inputRef.value === "" ? this.state.editItem.discount : this.discountEdit.inputRef.value
    var category = this.categoryEdit.inputRef.value === "" ? this.state.editItem.category : this.categoryEdit.inputRef.value
    var img = this.imgEdit.inputRef.value === "" ? this.state.editItem.img : this.imgEdit.inputRef.value
    var deskripsi = this.deskripsiEdit.inputRef.value === "" ? this.state.editItem.deskripsi : this.deskripsiEdit.inputRef.value
    var newData =
    {
      nama : namaproduk,
      harga,
      discount,
      category,
      img,
      deskripsi
    }
    Axios.put(urlApi + '/product/' + this.state.editItem.id, newData)
    .then ((res) => {
      this.getDataApi()
      swal('Edit Status', 'Edit Product Success', 'success')
      this.setState({isEdit: false, editItem: {}})
    })
    .catch((err) => {
      console.log(err)})
  }

  render() {
    const { classes } = this.props;
    const { rows, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    var {nama, harga, discount, deskripsi, img, category} = this.state.editItem
    if (this.props.role === 'admin')
    {
    return (
        <div className="container">
            <Paper className={classes.root}>
            <div className={classes.tableWrapper}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontSize:'24px', fontWeight:'600'}}>ID</TableCell>
                        <TableCell style={{fontSize:'24px', fontWeight:'600'}}>NAME</TableCell>
                        <TableCell style={{fontSize:'24px', fontWeight:'600'}}>PRICE</TableCell>
                        <TableCell style={{fontSize:'24px', fontWeight:'600'}}>DISC</TableCell>
                        <TableCell style={{fontSize:'24px', fontWeight:'600'}}>CAT</TableCell>
                        <TableCell style={{fontSize:'24px', fontWeight:'600'}}>VIEW</TableCell>
                        <TableCell style={{fontSize:'24px', fontWeight:'600'}}>DESC</TableCell>
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

        {/* =============================================== ADD PRODUCT ========================================== */}
        <Paper className='mt-3'>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontSize:'24px', fontWeight:'600'}}>ADD PRODUCT</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Input ref={input => this.nama = input} className='mt-2 ml-2 mb-2' placeholder='Nama Product'/>
                            <Input ref={input => this.harga = input} className='mt-2 ml-2 mb-2' labelPosition='right' type='text' placeholder='Amount'>
                                <Label basic>Rp.</Label>
                                <input />
                                <Label>.00</Label>
                            </Input>
                            <Input ref={input => this.discount = input} className='mt-2 ml-2 mb-2' placeholder='Discount'/>
                            <Input ref={input => this.category = input} className='mt-2 ml-2 mb-2' placeholder='Category'/>
                            <Input ref={input => this.img = input} className='mt-2 ml-2 mb-2' placeholder='Images'/>
                            <Input ref={input => this.deskripsi = input} className='mt-2 ml-2 mb-2' placeholder='Deskripsi'/>
                            <Button animated color='green' onClick={this.onBtnAdd}>
                            <Button.Content visible>Add</Button.Content>
                            <Button.Content hidden>
                                <Icon name='add' />
                            </Button.Content>
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>               
            </Table>
        </Paper>
        {/* ====================================== END OF SECTION ADD PRODUCT ==================================== */}
        

        {/* ============================================ EDIT PRODUCT ============================================ */}
        {
          this.state.isEdit === true ?
          
          <Paper className='mt-3'>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontSize:'24px', fontWeight:'600'}}>EDIT PRODUCT{' ' +nama}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Input ref={input => this.namaEdit = input} className='mt-2 ml-2 mb-2' placeholder={nama}/>
                            <Input ref={input => this.hargaEdit = input} className='mt-2 ml-2 mb-2' labelPosition='right' type='text' placeholder={harga}>
                                <Label basic>Rp.</Label>
                                <input />
                                <Label>.00</Label>
                            </Input>
                            <Input ref={input => this.discountEdit = input} className='mt-2 ml-2 mb-2' placeholder={discount}/>
                            <Input ref={input => this.categoryEdit = input} className='mt-2 ml-2 mb-2' placeholder={category}/>
                            <Input ref={input => this.imgEdit = input} className='mt-2 ml-2 mb-2' placeholder={img}/>
                            <Input ref={input => this.deskripsiEdit = input} className='mt-2 ml-2 mb-2' placeholder={deskripsi}/>
                            <Button animated color='green' onClick={this.onBtnSave}>
                            <Button.Content visible>Save</Button.Content>
                            <Button.Content hidden>
                                <Icon name='save' />
                            </Button.Content>
                            </Button>
                            <Button animated color='red' onClick={this.onBtnCancel}>
                            <Button.Content visible>Cancel</Button.Content>
                            <Button.Content hidden>
                                <Icon name='cancel' />
                            </Button.Content>
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>               
            </Table>
        </Paper>
          : null
        
        }
        {/* ====================================== END OF SECTION EDIT PRODUCT ==================================== */}        

        </div>      
    );
    } return <PageNotFound/>
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    role : state.user.role
  }  
}

export default connect(mapStateToProps)(withStyles(styles)(CustomPaginationActionsTable));