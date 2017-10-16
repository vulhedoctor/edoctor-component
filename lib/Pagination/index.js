import React from 'react';
import PropTypes from 'prop-types';

const defaultRange = 3;

class MiniPagination extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      currentPage: props.currentPage || 1,
      totalPage: props.totalPage || 0,
    }
  }

  componentWillReceiveProps (nextProps) {
    let currentPage = nextProps.currentPage;
    let totalPage = nextProps.totalPage;

    return this.setState({
      currentPage, 
      totalPage
    });
  }

  render () {
    let currentPage = this.state.currentPage;
    let totalPage = this.state.totalPage;

    return (
      <div className="miniPagination">
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li>
              <button disabled={currentPage == 1} onClick={event => this.props.handleChangePage(1, event)}>
                <span aria-hidden="true">&lt;&lt;</span>
              </button>
            </li>
            <li>
              <button disabled={currentPage == 1} onClick={event => this.props.handleChangePage(currentPage - 1, event)}>
                <span aria-hidden="true">&lt;</span>
              </button>
            </li>

            <li className={"active"}><a>{currentPage}</a></li>
            
            <li>
              <button disabled={currentPage == totalPage} onClick={event => this.props.handleChangePage(currentPage + 1, event)}>
                <span aria-hidden="true">&gt;</span>
              </button>
            </li>
            <li>
              <button disabled={currentPage == totalPage} onClick={event => this.props.handleChangePage(totalPage, event)}>
                <span aria-hidden="true">&gt;&gt;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

class FullPagination extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      range: defaultRange,
      currentPage: props.currentPage || 1,
      totalPage: props.totalPage || 0
    };
  }

  componentWillReceiveProps (nextProps) {
    let currentPage = nextProps.currentPage || 1;
    let totalPage = nextProps.totalPage || 0;
    let range = nextProps.range || defaultRange;

    return this.setState({
      currentPage,
      totalPage,
      range
    });
  }
  
  renderDots (component) {
    for (let i = 1; i < 4; i++) {
      component.push(<li className="dot" key={`list_item_dot_${Math.random() * i}`}>.</li>);
    }
    return component;
  }

  renderItemPage () {
    let componentItemPage = [];
    let currentPage = this.state.currentPage;
    let totalPage = this.state.totalPage;
    let range = this.state.range;
    let beginItem = currentPage - range;
    let endItem = currentPage + range;
    
    if (endItem < (range * 2) + 1) {
      endItem = (range * 2) + 1;
    } 
    
    if (endItem >= totalPage - 1) {
      endItem = totalPage - 1;
      beginItem = totalPage - (range * 2);
    }

    if (beginItem <= 1) {
      beginItem = 1;
    } else if (beginItem > 2) {
      componentItemPage = this.renderDots(componentItemPage);
    }
    
    for (let item = beginItem; item <= endItem; item++) {
      componentItemPage.push((
        <li key={`list_item_${item}`} className={item==currentPage && "active"}>
          <button disabled={item == currentPage} onClick={event => this.props.handleChangePage(item, event)} href="#">{item}</button>
        </li>
      ));
    }

    if (endItem < totalPage - 1) {
      componentItemPage = this.renderDots(componentItemPage);
    }

    return componentItemPage;
  }

  renderPagination () {
    let range = this.state.range;
    let totalPage = this.state.totalPage;
    let currentPage = this.state.currentPage;

    return (
      <nav aria-label="Page navigation">
        <ul className="pagination">
          {currentPage !== 1 && (
            <li>
              <button onClick={event => this.props.handleChangePage(currentPage - 1, event)}>
                <span aria-hidden="true">&lt;</span>
              </button>
            </li>
          )}
          
          {currentPage - range > 1 && (
            <li>
              <button onClick={event => this.props.handleChangePage(1, event)}>
                <span aria-hidden="true">1</span>
              </button>
            </li>
          )}

          {this.renderItemPage()}

          <li className={currentPage === totalPage && 'active'}>
            <button disabled={currentPage == totalPage} onClick={event => this.props.handleChangePage(totalPage, event)}>
              <span aria-hidden="true">{totalPage}</span>
            </button>
          </li>

          {currentPage !== totalPage && (
            <li>
              <button onClick={event => this.props.handleChangePage(currentPage + 1, event)}>
                <span aria-hidden="true">&gt;</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  }

  render () {
    return (
      <div className="fullPagination">
        {this.renderPagination()}
      </div>
    );
  }
}

export default class Pagination extends React.Component {
  constructor (props) {
    super(props); 
    
    this.state = {
      mini: props.mini || false,
      responsive: props.responsive || true,
      range: defaultRange,
      currentPage: 1,
      totalPage: 0
    }
  }

  componentDidMount () {
    let responsive = this.state.responsive;
    if (responsive) {
      if (window.innerWidth <= 768 && !this.state.mini) {
        this.setState({mini: true});
      }
      window.addEventListener('resize', this.watchWindowScale, false);
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.watchWindowScale, false);
  }

  componentWillReceiveProps (nextProps) {
    let offset = nextProps.offset;
    let limit = nextProps.limit;
    let total = nextProps.total;
    let range = nextProps.range || defaultRange;
    let responsive = nextProps.responsive || true;
    let mini = nextProps.mini || false;
    if (window.innerWidth <= 768) {
      mini = true;
    }

    let currentPage = offset/limit + 1;
    let totalPage = parseInt(total/limit);
    if (total%limit > 0) totalPage++;

    return this.setState({
      responsive,
      currentPage, 
      totalPage,
      range,
      mini,
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    let isChangeCurrentPage = nextState.currentPage != this.state.currentPage;
    let isChangeTotalPage = nextState.totalPage != this.state.totalPage;
    let isChangeRange = nextState.range != this.state.range;
    let isChangeMini = nextState.mini != this.state.mini;

    return isChangeCurrentPage || isChangeTotalPage || isChangeRange || isChangeMini;
  } 

  // Handle

  watchWindowScale = (event) => {
    if (window.innerWidth <= 768) {
      return this.setState({mini: true});
    }
    if (this.state.mini) {
      return this.setState({mini: false});
    }
  }

  setSearchQueries = (offset) => {
    let {history, location} = this.props;
    let currentSearchQuery = getQuerySearch(location.search);
    let newSearchQuery = {offset};
    let searchObject = Object.assign(currentSearchQuery, newSearchQuery);
    history.push({
      pathname: location.pathname,
      search: `?${buildQuerySearch(searchObject)}`
    });
  }

  handleChangePage = (item, event) => {
    event.preventDefault();

    if (item < 1 || item > this.state.totalPage) {
      return false;
    }

    let limit = this.props.limit;
    let nextOffset = (item - 1) * limit;

    this.setSearchQueries(nextOffset);
    if (this.props.onChange && this.props.onChange instanceof Function) {
      this.props.onChange({
        offset: nextOffset,
        limit: limit
      });
    }
  }

  // Render
  render () {
    let currentPage = this.state.currentPage;
    let responsive = this.state.responsive;
    let totalPage = this.state.totalPage;
    let mini = this.state.mini;

    if (totalPage <= 1) return null;

    if (mini) {
      return <MiniPagination currentPage={currentPage} totalPage={totalPage} handleChangePage={this.handleChangePage} />
    }
    return <FullPagination currentPage={currentPage} totalPage={totalPage} handleChangePage={this.handleChangePage} />
  }
}

Pagination.PropTypes = {
  offset: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  mini: PropTypes.bool,
  responsive: PropTypes.bool,
  range: PropTypes.number,
  onChange: PropTypes.func
};