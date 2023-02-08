import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import { useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';

export default function Home() {
	const [selectedGender, setSelectedGender] = useState('');
	const [openGender, setOpenGender] = useState(false);

  const [ageValue, setAgeValue] = useState('');

	const getIdeas = (e) => {
		e.preventDefault();
    console.log(selectedGender);
    console.log(ageValue);
	}

	return (
		<>
			<Head>
				<title>Generate Gift Ideas</title>
			</Head>
			<section className={styles.ideapage}>
				<div className={styles.formarea}>
					<form onSubmit={getIdeas}>
						<div className={styles.innerform}>

              {/* Gender input */}
							<div className={styles.inputgroup}>
								<label>Select the gender of the person </label>
								<div
									onClick={() => setOpenGender(!openGender)}
									className={styles.dropdown}
									style={{
										borderRadius: openGender ? '10px 10px 0px 0px' : '10px',
									}}
								>
									<span>{selectedGender ? selectedGender : 'select'}</span>
									<BiChevronDown size={25} />
								</div>
								<ul
									style={{ display: openGender ? 'block' : 'none' }}
									className={styles.dropdownitems}
								>
									<li
										onClick={() => {
											setSelectedGender('male');
											setOpenGender(false);
										}}
									>
										Male
									</li>
									<li
										onClick={() => {
											setSelectedGender('female');
											setOpenGender(false);
										}}
									>
										Female
									</li>
									<li
										onClick={() => {
											setSelectedGender('other');
											setOpenGender(false);
										}}
									>
										Other
									</li>
								</ul>
							</div>

              <div className={styles.inputgroup}>
                <label>Age of the person</label>
                <div className={styles.numberinput}>
                  <input type="number"
                    min="1"
                    max="120"
                    value={ageValue}
                    onChange={(e) => setAgeValue(e.target.value)} />
                  <span>Years Old</span>
                </div>
              </div>

              <div className={styles.submit}>
                <button type='submit'>Generate Ideas</button>
              </div>

						</div>
					</form>
				</div>
			</section>
		</>
	);
}
