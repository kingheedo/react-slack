import customInput from '@hooks/customInput';
import { postSignUp } from '@apis/Signup';
import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {
    Header,
    Form,
    Label,
    Input,
    Button,
    Error,
    Success,
    LinkContainer,
} from './styles';
import { useQuery } from 'react-query';
import { getLogin } from '@apis/Login';

const SignUp = () => {
    const [email, , onChangeEmail] = customInput('');
    const [nickname, , onChangeNickname] = customInput('');
    const [password, , onChangePassword] = customInput('');
    const [passwordCheck, , onChangePasswordCheck] = customInput('');
    const [missMatch, setMissMatch] = useState(false);
    const [blankErr, setBlankError] = useState({
        allBlank: '',
        emailBlank: '',
        nicknameBlank: '',
        passwordBlank: '',
        passwordCheckBlank: '',
    });
    const [signUpError, setSignUpError] = useState('')
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    const { isLoading, error, data: loginData } = useQuery(['login'], () => getLogin());
    const navigate = useNavigate();
    const checkBlank = () => {

        if (!email && !nickname && !password && !passwordCheck) {
            setBlankError(prev => ({ ...prev, allBlank: '빈칸을 모두 입력해주세요.' }));
            return;
        }
        !email && setBlankError(prev => ({ ...prev, emailBlank: '이메일을 입력해주세요' }));
        !nickname && setBlankError(prev => ({ ...prev, nicknameBlank: '닉네임을 입력해주세요' }));
        !password && setBlankError(prev => ({ ...prev, passwordBlank: '비밀번호를 입력해주세요' }));
        !passwordCheck && setBlankError(prev => ({ ...prev, passwordCheckBlank: '비밀번호 확인을 입력해주세요' }));

    }


    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email, nickname, password, passwordCheck);
        setBlankError({
            allBlank: '',
            emailBlank: '',
            nicknameBlank: '',
            passwordBlank: '',
            passwordCheckBlank: '',
        });
        checkBlank();
        setSignUpError('');

        if (email && nickname && !missMatch) {
            setSignUpSuccess(false);
            postSignUp({ email, nickname, password })
                .then((res) => {
                    console.log('res', res.data);
                    setSignUpSuccess(true);
                })
                .catch((error) => {
                    console.log(error.response);
                    setSignUpError(error.response.data);
                })
        }
    }

    useEffect(() => {
        if ((password && passwordCheck !== '') && (password !== passwordCheck)) {
            setMissMatch(true)
        } else {
            setMissMatch(false);
        }
    }, [password, passwordCheck])

    if (isLoading) {
        return <div>로딩중...</div>
    }

    if (loginData) {
        navigate('/workspace/channel');
    }
    return (
        <div id="container">
            <Header>Sleact</Header>
            <Form onSubmit={onSubmit}>
                <Label id="email-label">
                    <span>이메일 주소</span>
                    <div>
                        <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail}></Input>
                    </div>
                </Label>
                <Label id="nickname-label">
                    <span>닉네임</span>
                    <div>
                        <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname}></Input>
                    </div>
                </Label>
                <Label id="password-label">
                    <span>비밀번호</span>
                    <div>
                        <Input type="password" id="password" name="password" value={password} onChange={onChangePassword}></Input>
                    </div>
                </Label>
                <Label id="password-check-label">
                    <span>비밀번호 확인</span>
                    <div>
                        <Input type="password" id="password-check" name="password-check" value={passwordCheck} onChange={onChangePasswordCheck}></Input>
                    </div>
                    {blankErr.allBlank && <Error>{blankErr.allBlank}</Error>}
                    {blankErr.emailBlank && <Error>{blankErr.emailBlank}</Error>}
                    {blankErr.nicknameBlank && <Error>{blankErr.nicknameBlank}</Error>}
                    {blankErr.passwordBlank && <Error>{blankErr.passwordBlank}</Error>}
                    {blankErr.passwordCheckBlank && <Error>{blankErr.passwordCheckBlank}</Error>}
                    {missMatch && <Error>비밀번호가 일치하지 않습니다.</Error>}
                    {signUpError && <Error>{signUpError}</Error>}
                    {signUpSuccess && <Success>회원가입이 되었습니다!</Success>}
                </Label>
                <Button type="submit">회원가입</Button>
            </Form>
            <LinkContainer>
                이미 회원이신가요?&nbsp;
                <Link to="/login">로그인 하러가기</Link>
            </LinkContainer>
        </div>
    )
}

export default SignUp