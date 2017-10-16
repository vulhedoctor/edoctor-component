import React from 'react';
import {Route, Link, matchPath} from 'react-router-dom';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';

const getPaths = pathname => {
  const paths = ['/'];

  if (pathname === '/') return paths;

  pathname.split('/').reduce((prev, curr, index) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  return paths;
};

const getRouteName = (path, breadcrumbs) => {
  if (breadcrumbs[path]) {
    return breadcrumbs[path];
  } 

  for (let breadcrumbPath in breadcrumbs) {
    if (matchPath(path, {
      path: breadcrumbPath,
      exact: true 
    })) {
      return breadcrumbs[breadcrumbPath];
    }
  }

  return false;
}

export default class Breadcrumbs extends React.Component {
  constructor (props) {
    super(props);
    this.breadcrumbs = props.breadcrumbs;
  }

  renderBreadcrumbItem (path) {
    let {location} = this.props;
    let routeName = getRouteName(path, this.breadcrumbs);

    if (routeName) {
      return (
        location.pathname == path ? (
          <BreadcrumbItem active>{routeName}</BreadcrumbItem>
        ) : (
          <BreadcrumbItem>
            <Link to={path}>
              {routeName}
            </Link>
          </BreadcrumbItem>
        )
      )
    }
  } 

  renderBreadcrumbs () {
    let {location: {pathname}, match} = this.props;
    let paths = getPaths(pathname);
    return (
      <Breadcrumb>
        {paths.map((path, i) => (
          <Route key={i+1} path={path}>
            {this.renderBreadcrumbItem(path)}
          </Route>
        ))}
      </Breadcrumb>
    );
  }

  render () {
    return (
      <div>
        <Route path='/:path' {...this.props}>
          {this.renderBreadcrumbs()}
        </Route>
      </div>
    );
  }
}
