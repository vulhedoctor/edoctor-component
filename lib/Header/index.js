import PropTypes from 'prop-types'; 
import {connect} from 'react-redux'; 
import React, {Component} from 'react';
import Lodash from 'lodash';

import {
  Badge,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
  NavbarBrand,
  DropdownToggle
} from 'reactstrap';

import {Link} from 'react-router-dom';
import avatar from 'Public/img/avatars/1.png';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      navItems: [],
      user: {},
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.nav && nextProps.nav.items) {
      this.setState({
        navItems: nextProps.nav.items
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    let updateState = {};
    if (nextProps.user) {
      updateState.user = nextProps.user;
    }
    if (nextProps.nav && nextProps.nav.items) {
      updateState.navItems = nextProps.nav.items;
    }
    return this.setState(updateState);
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  handleSignOut = (event) => { 
    event.preventDefault(); 
    return PopupConfirm({ 
      title: 'Bạn có chắc muốn đăng xuất?',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'Tôi ấn nhầm'
    }).then(() => {
      if (this.props.handleSignOut && this.props.handleSignOut instanceof Function) {
        this.props.handleSignOut();
      }
    }); 
  }

  renderNavItems () {
    return this.state.navItems.map((item, index) => (
      <NavItem className="px-3" key={`header_nav_item_${index}`}>
        <Link to={item.url}>{item.name}</Link>
      </NavItem>
    ));
  }

  render () {
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>&#9776;</NavbarToggler>
        <Link className="navbar-brand" to='/' />
        <NavbarToggler className="d-md-down-none" onClick={this.sidebarToggle}>&#9776;</NavbarToggler>
        <Nav className="d-md-down-none" navbar>
          {this.renderNavItems()}
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle className="nav-link dropdown-toggle">
                <img src={avatar} className="img-avatar" alt="hotro@edoctor.vn"/>
                <span className="d-md-down-none">{Lodash.get(this.state.user, 'name', 'Không rõ')}</span>
              </DropdownToggle>
              <DropdownMenu right className={this.state.dropdownOpen ? 'show' : ''}>
                <DropdownItem onClick={this.handleSignOut}><i className="fa fa-lock"></i> Đăng xuất</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavItem>
        </Nav>
      </header>
    )
  }
}

Header.PropTypes = {
  nav: PropTypes.object,
  user: PropTypes.object.isRequired,
  handleSignOut: PropTypes.func.isRequired
};

export default Header;
