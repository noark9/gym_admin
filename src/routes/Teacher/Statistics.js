import React, {Component} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card} from 'antd';

export default class Page extends Component {
  render() {
    return (
      <PageHeaderLayout title="课程统计">
        <Card bordered={false}>
        </Card>
      </PageHeaderLayout>
    )
  }
}