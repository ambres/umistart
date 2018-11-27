import React from 'react';
import PropTypes from 'prop-types';
import { ListView } from 'antd-mobile';
import styles from './ComListView.less';

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children.length === 0 ? props.displayWhenNoData || <span style={styles['box-no-data']}>暂无数据</span> : props.children}
    </div>
  );
}

class ComListView extends React.Component {
  constructor(props) {
    super(props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
    
    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    
    this.state = {
      dataSource,
      isLoading: true,
      height: document.documentElement.clientHeight * 3 / 4,
    };
  }
  
  componentDidMount() {
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);
    const hei = document.documentElement.clientHeight - document.documentElement.querySelector(".container-com-list-view").offsetTop;
  
    this.genDataSource(this.props.dataSource);
    
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlobs, this.sectionIDs, this.rowIDs),
      isLoading: false,
      height: hei,
    });
  }
  
  //If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
  componentWillReceiveProps(nextProps) {
    const {dataSource} = nextProps;
    
    if (dataSource.items) {
      this.genDataSource(dataSource);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlobs, this.sectionIDs, this.rowIDs)
      });
    }
  }
  
  sectionIDs = [];
  dataBlobs = {};
  rowIDs = [];
  genDataSource = (data) => {
    const {items, currentPage, itemsPerPage, totalPages, totalItems} = data;
  
    this.dataBlobs = {};
    this.sectionIDs = [];
    this.rowIDs = [];
    
    let maxPages = items.length === 0 ? 0 : items.length === totalItems ? totalPages : currentPage;
    for(let i=0; i < maxPages; i++) {
      const sectionName = `Section ${i + 1}`;
      
      this.sectionIDs.push(sectionName);
      this.dataBlobs[sectionName] = sectionName;
      this.rowIDs[i] = [];
      
      let maxItems = (i+1) === totalPages && (totalItems%itemsPerPage) !== 0 ? totalItems%itemsPerPage : itemsPerPage;
      for (let jj = 0; jj < maxItems; jj++) {
        let index = i*itemsPerPage + jj;
        const rowID = items[index]['guid'];
        this.rowIDs[i].push(rowID);
        this.dataBlobs[rowID] = items[index];
      }
      
      this.sectionIDs = [...this.sectionIDs];
      this.rowIDs = [...this.rowIDs];
    }
  }
  
  onEndReached = (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    /*if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({ isLoading: true });
    setTimeout(() => {
      genData(++pageIndex);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
        isLoading: false,
      });
    }, 1000);*/
    this.props.onEndReached && this.props.onEndReached(event);
  }
  
  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    
    return (
      <div className="container-com-list-view">
        <ListView
          className={this.props.classNames}
          dataSource={this.state.dataSource}
          renderHeader={this.props.renderHeader}
          renderFooter={this.props.renderFooter}
          renderBodyComponent={() => <MyBody displayWhenNoData={this.props.displayWhenNoData} />}
          renderRow={this.props.renderRow}
          renderSeparator={separator}
          style={{
            height: this.state.height,
            overflow: 'auto',
          }}
          pageSize={4}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
      </div>
    );
  }
}

export default ComListView;

ComListView.propTypes = {
  renderRow: PropTypes.func.isRequired,
  dataSource: PropTypes.object.isRequired,
  classNames: PropTypes.string,
  onEndReached: PropTypes.func.isRequired,
  renderHeader: PropTypes.func,
  renderFooter: PropTypes.func,
  displayWhenNoData: PropTypes.object
}
