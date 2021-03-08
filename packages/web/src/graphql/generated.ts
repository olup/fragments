import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};


export type Fragment = {
  __typename?: 'Fragment';
  uuid?: Maybe<Scalars['ID']>;
  handle: Scalars['String'];
  content: Scalars['String'];
  previewContent: Scalars['String'];
  linksTo: Array<Fragment>;
  linkedBy: Array<Fragment>;
  tags: Array<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
};

export type FragmentInput = {
  uuid?: Maybe<Scalars['ID']>;
  handle?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
};

export type SearchFragmentInput = {
  tags?: Maybe<Scalars['String']>;
  handle?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  fragmentByHandle?: Maybe<Fragment>;
  fragments: Array<Fragment>;
  tags: Array<Scalars['String']>;
  me?: Maybe<User>;
};


export type QueryFragmentByHandleArgs = {
  handle: Scalars['String'];
};


export type QueryFragmentsArgs = {
  filter?: Maybe<SearchFragmentInput>;
};

export type Mutation = {
  __typename?: 'Mutation';
  saveFragment?: Maybe<Fragment>;
  deleteFragment: Scalars['Boolean'];
};


export type MutationSaveFragmentArgs = {
  fragment: FragmentInput;
};


export type MutationDeleteFragmentArgs = {
  uuid: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']>;
};

export type DeleteFragmentMutationVariables = Exact<{
  uuid: Scalars['ID'];
}>;


export type DeleteFragmentMutation = (
  { __typename?: 'Mutation' }
  & { done: Mutation['deleteFragment'] }
);

export type GetFragmentsHandleQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFragmentsHandleQuery = (
  { __typename?: 'Query' }
  & { fragments: Array<(
    { __typename?: 'Fragment' }
    & Pick<Fragment, 'uuid' | 'handle' | 'previewContent'>
  )> }
);

export type GetFragmentByHandleQueryVariables = Exact<{
  handle: Scalars['String'];
}>;


export type GetFragmentByHandleQuery = (
  { __typename?: 'Query' }
  & { fragmentByHandle?: Maybe<(
    { __typename?: 'Fragment' }
    & Pick<Fragment, 'uuid' | 'handle' | 'content' | 'createdAt' | 'tags'>
    & { linkedBy: Array<(
      { __typename?: 'Fragment' }
      & Pick<Fragment, 'uuid' | 'handle' | 'previewContent'>
    )>, linksTo: Array<(
      { __typename?: 'Fragment' }
      & Pick<Fragment, 'handle' | 'uuid' | 'previewContent'>
    )> }
  )> }
);

export type GetFragmentsQueryVariables = Exact<{
  filter?: Maybe<SearchFragmentInput>;
}>;


export type GetFragmentsQuery = (
  { __typename?: 'Query' }
  & { fragments: Array<(
    { __typename?: 'Fragment' }
    & Pick<Fragment, 'uuid' | 'handle' | 'content' | 'createdAt' | 'tags'>
    & { linkedBy: Array<(
      { __typename?: 'Fragment' }
      & Pick<Fragment, 'uuid' | 'handle' | 'previewContent'>
    )>, linksTo: Array<(
      { __typename?: 'Fragment' }
      & Pick<Fragment, 'handle' | 'uuid' | 'previewContent'>
    )> }
  )> }
);

export type GetFragmentsPreviewQueryVariables = Exact<{
  filter?: Maybe<SearchFragmentInput>;
}>;


export type GetFragmentsPreviewQuery = (
  { __typename?: 'Query' }
  & { fragments: Array<(
    { __typename?: 'Fragment' }
    & Pick<Fragment, 'uuid' | 'handle' | 'previewContent'>
  )> }
);

export type GetTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTagsQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'tags'>
);

export type SaveFragmentMutationVariables = Exact<{
  fragment: FragmentInput;
}>;


export type SaveFragmentMutation = (
  { __typename?: 'Mutation' }
  & { fragment?: Maybe<(
    { __typename?: 'Fragment' }
    & Pick<Fragment, 'uuid' | 'content' | 'handle'>
  )> }
);


export const DeleteFragmentDocument = gql`
    mutation deleteFragment($uuid: ID!) {
  done: deleteFragment(uuid: $uuid)
}
    `;
export type DeleteFragmentMutationFn = Apollo.MutationFunction<DeleteFragmentMutation, DeleteFragmentMutationVariables>;

/**
 * __useDeleteFragmentMutation__
 *
 * To run a mutation, you first call `useDeleteFragmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFragmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFragmentMutation, { data, loading, error }] = useDeleteFragmentMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteFragmentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFragmentMutation, DeleteFragmentMutationVariables>) {
        return Apollo.useMutation<DeleteFragmentMutation, DeleteFragmentMutationVariables>(DeleteFragmentDocument, baseOptions);
      }
export type DeleteFragmentMutationHookResult = ReturnType<typeof useDeleteFragmentMutation>;
export type DeleteFragmentMutationResult = Apollo.MutationResult<DeleteFragmentMutation>;
export type DeleteFragmentMutationOptions = Apollo.BaseMutationOptions<DeleteFragmentMutation, DeleteFragmentMutationVariables>;
export const GetFragmentsHandleDocument = gql`
    query getFragmentsHandle {
  fragments {
    uuid
    handle
    previewContent
  }
}
    `;

/**
 * __useGetFragmentsHandleQuery__
 *
 * To run a query within a React component, call `useGetFragmentsHandleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFragmentsHandleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFragmentsHandleQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFragmentsHandleQuery(baseOptions?: Apollo.QueryHookOptions<GetFragmentsHandleQuery, GetFragmentsHandleQueryVariables>) {
        return Apollo.useQuery<GetFragmentsHandleQuery, GetFragmentsHandleQueryVariables>(GetFragmentsHandleDocument, baseOptions);
      }
export function useGetFragmentsHandleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFragmentsHandleQuery, GetFragmentsHandleQueryVariables>) {
          return Apollo.useLazyQuery<GetFragmentsHandleQuery, GetFragmentsHandleQueryVariables>(GetFragmentsHandleDocument, baseOptions);
        }
export type GetFragmentsHandleQueryHookResult = ReturnType<typeof useGetFragmentsHandleQuery>;
export type GetFragmentsHandleLazyQueryHookResult = ReturnType<typeof useGetFragmentsHandleLazyQuery>;
export type GetFragmentsHandleQueryResult = Apollo.QueryResult<GetFragmentsHandleQuery, GetFragmentsHandleQueryVariables>;
export const GetFragmentByHandleDocument = gql`
    query getFragmentByHandle($handle: String!) {
  fragmentByHandle(handle: $handle) {
    uuid
    handle
    content
    createdAt
    tags
    linkedBy {
      uuid
      handle
      previewContent
    }
    linksTo {
      handle
      uuid
      previewContent
    }
  }
}
    `;

/**
 * __useGetFragmentByHandleQuery__
 *
 * To run a query within a React component, call `useGetFragmentByHandleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFragmentByHandleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFragmentByHandleQuery({
 *   variables: {
 *      handle: // value for 'handle'
 *   },
 * });
 */
export function useGetFragmentByHandleQuery(baseOptions?: Apollo.QueryHookOptions<GetFragmentByHandleQuery, GetFragmentByHandleQueryVariables>) {
        return Apollo.useQuery<GetFragmentByHandleQuery, GetFragmentByHandleQueryVariables>(GetFragmentByHandleDocument, baseOptions);
      }
export function useGetFragmentByHandleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFragmentByHandleQuery, GetFragmentByHandleQueryVariables>) {
          return Apollo.useLazyQuery<GetFragmentByHandleQuery, GetFragmentByHandleQueryVariables>(GetFragmentByHandleDocument, baseOptions);
        }
export type GetFragmentByHandleQueryHookResult = ReturnType<typeof useGetFragmentByHandleQuery>;
export type GetFragmentByHandleLazyQueryHookResult = ReturnType<typeof useGetFragmentByHandleLazyQuery>;
export type GetFragmentByHandleQueryResult = Apollo.QueryResult<GetFragmentByHandleQuery, GetFragmentByHandleQueryVariables>;
export const GetFragmentsDocument = gql`
    query getFragments($filter: SearchFragmentInput) {
  fragments(filter: $filter) {
    uuid
    handle
    content
    createdAt
    tags
    linkedBy {
      uuid
      handle
      previewContent
    }
    linksTo {
      handle
      uuid
      previewContent
    }
  }
}
    `;

/**
 * __useGetFragmentsQuery__
 *
 * To run a query within a React component, call `useGetFragmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFragmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFragmentsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetFragmentsQuery(baseOptions?: Apollo.QueryHookOptions<GetFragmentsQuery, GetFragmentsQueryVariables>) {
        return Apollo.useQuery<GetFragmentsQuery, GetFragmentsQueryVariables>(GetFragmentsDocument, baseOptions);
      }
export function useGetFragmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFragmentsQuery, GetFragmentsQueryVariables>) {
          return Apollo.useLazyQuery<GetFragmentsQuery, GetFragmentsQueryVariables>(GetFragmentsDocument, baseOptions);
        }
export type GetFragmentsQueryHookResult = ReturnType<typeof useGetFragmentsQuery>;
export type GetFragmentsLazyQueryHookResult = ReturnType<typeof useGetFragmentsLazyQuery>;
export type GetFragmentsQueryResult = Apollo.QueryResult<GetFragmentsQuery, GetFragmentsQueryVariables>;
export const GetFragmentsPreviewDocument = gql`
    query getFragmentsPreview($filter: SearchFragmentInput) {
  fragments(filter: $filter) {
    uuid
    handle
    previewContent
  }
}
    `;

/**
 * __useGetFragmentsPreviewQuery__
 *
 * To run a query within a React component, call `useGetFragmentsPreviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFragmentsPreviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFragmentsPreviewQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetFragmentsPreviewQuery(baseOptions?: Apollo.QueryHookOptions<GetFragmentsPreviewQuery, GetFragmentsPreviewQueryVariables>) {
        return Apollo.useQuery<GetFragmentsPreviewQuery, GetFragmentsPreviewQueryVariables>(GetFragmentsPreviewDocument, baseOptions);
      }
export function useGetFragmentsPreviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFragmentsPreviewQuery, GetFragmentsPreviewQueryVariables>) {
          return Apollo.useLazyQuery<GetFragmentsPreviewQuery, GetFragmentsPreviewQueryVariables>(GetFragmentsPreviewDocument, baseOptions);
        }
export type GetFragmentsPreviewQueryHookResult = ReturnType<typeof useGetFragmentsPreviewQuery>;
export type GetFragmentsPreviewLazyQueryHookResult = ReturnType<typeof useGetFragmentsPreviewLazyQuery>;
export type GetFragmentsPreviewQueryResult = Apollo.QueryResult<GetFragmentsPreviewQuery, GetFragmentsPreviewQueryVariables>;
export const GetTagsDocument = gql`
    query getTags {
  tags
}
    `;

/**
 * __useGetTagsQuery__
 *
 * To run a query within a React component, call `useGetTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTagsQuery(baseOptions?: Apollo.QueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
        return Apollo.useQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, baseOptions);
      }
export function useGetTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
          return Apollo.useLazyQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, baseOptions);
        }
export type GetTagsQueryHookResult = ReturnType<typeof useGetTagsQuery>;
export type GetTagsLazyQueryHookResult = ReturnType<typeof useGetTagsLazyQuery>;
export type GetTagsQueryResult = Apollo.QueryResult<GetTagsQuery, GetTagsQueryVariables>;
export const SaveFragmentDocument = gql`
    mutation saveFragment($fragment: FragmentInput!) {
  fragment: saveFragment(fragment: $fragment) {
    uuid
    content
    handle
  }
}
    `;
export type SaveFragmentMutationFn = Apollo.MutationFunction<SaveFragmentMutation, SaveFragmentMutationVariables>;

/**
 * __useSaveFragmentMutation__
 *
 * To run a mutation, you first call `useSaveFragmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveFragmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveFragmentMutation, { data, loading, error }] = useSaveFragmentMutation({
 *   variables: {
 *      fragment: // value for 'fragment'
 *   },
 * });
 */
export function useSaveFragmentMutation(baseOptions?: Apollo.MutationHookOptions<SaveFragmentMutation, SaveFragmentMutationVariables>) {
        return Apollo.useMutation<SaveFragmentMutation, SaveFragmentMutationVariables>(SaveFragmentDocument, baseOptions);
      }
export type SaveFragmentMutationHookResult = ReturnType<typeof useSaveFragmentMutation>;
export type SaveFragmentMutationResult = Apollo.MutationResult<SaveFragmentMutation>;
export type SaveFragmentMutationOptions = Apollo.BaseMutationOptions<SaveFragmentMutation, SaveFragmentMutationVariables>;