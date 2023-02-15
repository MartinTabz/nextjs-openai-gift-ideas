import Loading from '@/components/loading';
import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import { useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { HiX } from 'react-icons/hi';

export default function Home() {
	const [isLoading, setIsLoading] = useState(false);
	const [gotResults, setGotResults] = useState(false);
	const [ideasValue, setIdeasValue] = useState('');

	// Gender input and selection box
	const [selectedGender, setSelectedGender] = useState('');
	const [openGender, setOpenGender] = useState(false);
	const [genderError, setGenderError] = useState(false);

	// Age input
	const [ageValue, setAgeValue] = useState('');
	const [ageError, setAgeError] = useState(false);

	// Declaration of tags array
	const [tags, setTags] = useState([]);
	const [tagsError, setTagsError] = useState(false);
	//Function for processing the tags
	function handleKeydown(e) {
		if (e.key !== 'Enter') {
			setTagsError(false);
			return;
		}
		const value = e.target.value;
		if (!value.trim()) {
			return;
		}
		if (tags.includes(value)) {
			e.target.value = '';
			return;
		}
		setTags([...tags, value]);
		e.target.value = '';
	}
	// Function from removing tags from array by clicking the X
	function removeTag(index) {
		setTags(tags.filter((el, i) => i !== index));
	}

	// To prevent submitting the form on Enter
	// Because it is used to input tags to array
	const handleKeydownForm = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	};

	// Submitting form
	const getIdeas = async (e) => {
		e.preventDefault();

		// Error conditions
		var inputerror = false;
		if (!selectedGender) {
			setGenderError(true);
			inputerror = true;
		}
		if (!ageValue) {
			setAgeError(true);
			inputerror = true;
		}
		if (tags.length <= 4) {
			setTagsError(true);
			inputerror = true;
		}

		// If there is no error, data gets sent to API
		if (!inputerror) {
			setIsLoading(true);
			const body = {
				gender: selectedGender,
				age: ageValue,
				interests: tags,
			};
			const res = await fetch('/api/getideas', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});
			const suggestions = await res.json();
			console.log(suggestions.result);
			setIdeasValue(JSON.parse(suggestions.result));
			setGotResults(true);
			setIsLoading(false);
		}
	};

	return (
		<>
			<Head>
				<title>Generate Gift Ideas</title>
			</Head>
			{isLoading ? (
				<Loading />
			) : gotResults ? (
				<section> {ideasValue.map((item, index) => (
					<h2 key={index}>{item}</h2>
				 ))}</section>
			) : (
				<section className={styles.ideapage}>
					<div className={styles.formarea}>
						<form onKeyDown={handleKeydownForm} onSubmit={getIdeas}>
							<div className={styles.innerform}>
								{/* Gender input */}
								<div className={styles.inputgroup}>
									<label>Select the gender of the person </label>
									<div
										onClick={() => {
											setOpenGender(!openGender);
											setGenderError(false);
										}}
										className={styles.dropdown}
										style={{
											border: genderError && ' 2px solid red',
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
									<div
										style={{
											border: ageError && ' 2px solid red',
										}}
										className={styles.numberinput}
									>
										<input
											type="number"
											min="1"
											max="120"
											value={ageValue}
											onChange={(e) => {
												setAgeValue(e.target.value);
												setAgeError(false);
											}}
										/>
										<span>Years Old</span>
									</div>
								</div>

								<div className={styles.inputgroup}>
									<label>
										Enter the person&apos;s interests{' '}
										<span
											style={{
												color: tagsError && 'red',
											}}
										>
											Atleast 5
										</span>
									</label>
									<div
										style={{
											border: tagsError && '2px solid red',
										}}
										className={styles.interestinputarea}
									>
										{tags.map((tag, index) => (
											<div key={index} className={styles.tagitem}>
												<span className={styles.tagname}>{tag}</span>
												<span
													onClick={() => removeTag(index)}
													className={styles.tagicon}
												>
													<HiX size={16} />
												</span>
											</div>
										))}
										<input
											onKeyDown={handleKeydown}
											placeholder="Enter an interest..."
											className={styles.interestinput}
											type="text"
										/>
									</div>
								</div>

								<div className={styles.submit}>
									<button type="submit">Generate Ideas</button>
								</div>
							</div>
						</form>
					</div>
				</section>
			)}
		</>
	);
}
